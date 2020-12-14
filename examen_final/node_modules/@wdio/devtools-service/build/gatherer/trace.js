"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/modules/web.url");
const events_1 = require("events");
const network_recorder_1 = __importDefault(require("lighthouse/lighthouse-core/lib/network-recorder"));
const logger_1 = __importDefault(require("@wdio/logger"));
const registerPerformanceObserverInPage_1 = __importDefault(require("../scripts/registerPerformanceObserverInPage"));
const checkTimeSinceLastLongTask_1 = __importDefault(require("../scripts/checkTimeSinceLastLongTask"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const log = logger_1.default('@wdio/devtools-service:TraceGatherer');
const NETWORK_RECORDER_EVENTS = [
    'Network.requestWillBeSent',
    'Network.requestServedFromCache',
    'Network.responseReceived',
    'Network.dataReceived',
    'Network.loadingFinished',
    'Network.loadingFailed',
    'Network.resourceChangedPriority'
];
const NOOP_WAIT_EVENT = {
    promise: Promise.resolve(),
    cancel: () => { }
};
class TraceGatherer extends events_1.EventEmitter {
    constructor(session, page) {
        super();
        this._failingFrameLoadIds = [];
        this._pageLoadDetected = false;
        this._networkListeners = {};
        this._waitForNetworkIdleEvent = NOOP_WAIT_EVENT;
        this._waitForCPUIdleEvent = NOOP_WAIT_EVENT;
        this._session = session;
        this._page = page;
        NETWORK_RECORDER_EVENTS.forEach((method) => {
            this._networkListeners[method] = (params) => this._networkStatusMonitor.dispatch({ method, params });
        });
    }
    async startTracing(url) {
        delete this._trace;
        this._networkStatusMonitor = new network_recorder_1.default();
        NETWORK_RECORDER_EVENTS.forEach((method) => {
            this._session.on(method, this._networkListeners[method]);
        });
        this._traceStart = Date.now();
        log.info(`Start tracing frame with url ${url}`);
        await this._page.tracing.start({
            categories: constants_1.DEFAULT_TRACING_CATEGORIES,
            screenshots: true
        });
        if (url === constants_1.CLICK_TRANSITION) {
            log.info('Start checking for page load for click');
            this._clickTraceTimeout = setTimeout(async () => {
                log.info('No page load detected, canceling trace');
                await this._page.tracing.stop();
                return this.finishTracing();
            }, constants_1.FRAME_LOAD_START_TIMEOUT);
        }
        await this._page.evaluateOnNewDocument(registerPerformanceObserverInPage_1.default);
        this._waitForNetworkIdleEvent = this.waitForNetworkIdle(this._session);
        this._waitForCPUIdleEvent = this.waitForCPUIdle();
    }
    async onFrameNavigated(msgObj) {
        if (!this.isTracing) {
            return;
        }
        if (this._failingFrameLoadIds.includes(msgObj.frame.id)) {
            delete this._traceStart;
            this._waitForNetworkIdleEvent.cancel();
            this._waitForCPUIdleEvent.cancel();
            this._frameId = '"unsuccessful loaded frame"';
            this.finishTracing();
            this.emit('tracingError', new Error(`Page with url "${msgObj.frame.url}" failed to load`));
            if (this._clickTraceTimeout) {
                clearTimeout(this._clickTraceTimeout);
            }
        }
        if (this._frameId ||
            msgObj.frame.parentId ||
            !utils_1.isSupportedUrl(msgObj.frame.url)) {
            log.info(`Ignore navigated frame with url ${msgObj.frame.url}`);
            return;
        }
        this._frameId = msgObj.frame.id;
        this._loaderId = msgObj.frame.loaderId;
        this._pageUrl = msgObj.frame.url;
        log.info(`Page load detected: ${this._pageUrl}, set frameId ${this._frameId}, set loaderId ${this._loaderId}`);
        if (this._clickTraceTimeout && !this._pageLoadDetected) {
            log.info('Page load detected for click, clearing click trace timeout}');
            this._pageLoadDetected = true;
            clearTimeout(this._clickTraceTimeout);
        }
        this.emit('tracingStarted', msgObj.frame.id);
    }
    async onLoadEventFired() {
        if (!this.isTracing) {
            return;
        }
        const loadPromise = Promise.all([
            this._waitForNetworkIdleEvent.promise,
            this._waitForCPUIdleEvent.promise
        ]).then(() => async () => {
            const minTraceTime = constants_1.TRACING_TIMEOUT - (Date.now() - (this._traceStart || 0));
            if (minTraceTime > 0) {
                log.info(`page load happen to quick, waiting ${minTraceTime}ms more`);
                await new Promise((resolve) => setTimeout(resolve, minTraceTime));
            }
            return this.completeTracing();
        });
        const cleanupFn = await Promise.race([
            loadPromise,
            this.waitForMaxTimeout()
        ]);
        this._waitForNetworkIdleEvent.cancel();
        this._waitForCPUIdleEvent.cancel();
        return cleanupFn();
    }
    onFrameLoadFail(request) {
        const frame = request.frame();
        if (frame) {
            this._failingFrameLoadIds.push(frame._id);
        }
    }
    get isTracing() {
        return typeof this._traceStart === 'number';
    }
    async completeTracing() {
        const traceDuration = Date.now() - (this._traceStart || 0);
        log.info(`Tracing completed after ${traceDuration}ms, capturing performance data for frame ${this._frameId}`);
        try {
            const traceBuffer = await this._page.tracing.stop();
            const traceEvents = JSON.parse(traceBuffer.toString('utf8'));
            const startedInBrowserEvt = traceEvents.traceEvents.find(e => e.name === 'TracingStartedInBrowser');
            const mainFrame = (startedInBrowserEvt &&
                startedInBrowserEvt.args &&
                startedInBrowserEvt.args['data']['frames'] &&
                startedInBrowserEvt.args['data']['frames'].find((frame) => !frame.parent));
            if (mainFrame && mainFrame.processId) {
                const threadNameEvt = traceEvents.traceEvents.find(e => e.ph === 'R' &&
                    e.cat === 'blink.user_timing' && e.name === 'navigationStart' && e.args.data.isLoadingMainFrame);
                if (threadNameEvt) {
                    log.info(`Replace mainFrame process id ${mainFrame.processId} with actual thread process id ${threadNameEvt.pid}`);
                    mainFrame.processId = threadNameEvt.pid;
                }
                else {
                    log.info(`Couldn't replace mainFrame process id ${mainFrame.processId} with actual thread process id`);
                }
            }
            this._trace = {
                ...traceEvents,
                frameId: this._frameId,
                loaderId: this._loaderId,
                pageUrl: this._pageUrl,
                traceStart: this._traceStart,
                traceEnd: Date.now()
            };
            this.emit('tracingComplete', this._trace);
            this.finishTracing();
        }
        catch (err) {
            log.error(`Error capturing tracing logs: ${err.stack}`);
            this.emit('tracingError', err);
            return this.finishTracing();
        }
    }
    finishTracing() {
        log.info(`Tracing for ${this._frameId} completed`);
        this._pageLoadDetected = false;
        NETWORK_RECORDER_EVENTS.forEach((method) => this._session.removeListener(method, this._networkListeners[method]));
        delete this._networkStatusMonitor;
        delete this._traceStart;
        delete this._frameId;
        delete this._loaderId;
        delete this._pageUrl;
        this._failingFrameLoadIds = [];
        this._waitForNetworkIdleEvent.cancel();
        this._waitForCPUIdleEvent.cancel();
        this.emit('tracingFinished');
    }
    waitForNetworkIdle(session, networkQuietThresholdMs = constants_1.NETWORK_IDLE_TIMEOUT) {
        let hasDCLFired = false;
        let idleTimeout;
        let cancel = () => {
            throw new Error('_waitForNetworkIdle.cancel() called before it was defined');
        };
        if (!this._networkStatusMonitor) {
            throw new Error('TraceGatherer.waitForNetworkIdle called with no networkStatusMonitor');
        }
        const networkStatusMonitor = this._networkStatusMonitor;
        const promise = new Promise((resolve) => {
            const onIdle = () => {
                networkStatusMonitor.once('network-2-busy', onBusy);
                idleTimeout = setTimeout(() => {
                    log.info('Network became finally idle');
                    cancel();
                    resolve();
                }, networkQuietThresholdMs);
            };
            const onBusy = () => {
                networkStatusMonitor.once('network-2-idle', onIdle);
                idleTimeout && clearTimeout(idleTimeout);
            };
            const domContentLoadedListener = () => {
                hasDCLFired = true;
                networkStatusMonitor.is2Idle()
                    ? onIdle()
                    : onBusy();
            };
            const logStatus = () => {
                if (!hasDCLFired) {
                    return log.info('Waiting on DomContentLoaded');
                }
                const inflightRecords = networkStatusMonitor.getInflightRecords();
                log.info(`Found ${inflightRecords.length} inflight network records`);
                if (inflightRecords.length < 10) {
                    for (const record of inflightRecords) {
                        log.info(`Waiting on ${record.url.slice(0, 120)} to finish`);
                    }
                }
            };
            networkStatusMonitor.on('requeststarted', logStatus);
            networkStatusMonitor.on('requestloaded', logStatus);
            networkStatusMonitor.on('network-2-busy', logStatus);
            session.once('Page.domContentEventFired', domContentLoadedListener);
            let canceled = false;
            cancel = () => {
                if (canceled)
                    return;
                canceled = true;
                log.info('Wait for network idle canceled');
                idleTimeout && clearTimeout(idleTimeout);
                session.removeListener('Page.domContentEventFired', domContentLoadedListener);
                networkStatusMonitor.removeListener('network-2-busy', onBusy);
                networkStatusMonitor.removeListener('network-2-idle', onIdle);
                networkStatusMonitor.removeListener('requeststarted', logStatus);
                networkStatusMonitor.removeListener('requestloaded', logStatus);
                networkStatusMonitor.removeListener('network-2-busy', logStatus);
            };
        });
        return { promise, cancel };
    }
    waitForCPUIdle(waitForCPUIdle = constants_1.CPU_IDLE_TRESHOLD) {
        if (!waitForCPUIdle) {
            return {
                promise: Promise.resolve(),
                cancel: () => undefined
            };
        }
        let lastTimeout;
        let canceled = false;
        const checkForQuietExpression = `(${checkTimeSinceLastLongTask_1.default.toString()})()`;
        async function checkForQuiet(resolve, reject) {
            if (canceled)
                return;
            let timeSinceLongTask;
            try {
                timeSinceLongTask = (await this._page.evaluate(checkForQuietExpression)) || 0;
            }
            catch (e) {
                log.warn(`Page evaluate rejected while evaluating checkForQuietExpression: ${e.stack}`);
                setTimeout(() => checkForQuiet.call(this, resolve, reject), 100);
                return;
            }
            if (canceled)
                return;
            if (typeof timeSinceLongTask !== 'number') {
                log.warn(`unexpected value for timeSinceLongTask: ${timeSinceLongTask}`);
                return reject(new Error('timeSinceLongTask is not a number'));
            }
            log.info('Driver', `CPU has been idle for ${timeSinceLongTask} ms`);
            if (timeSinceLongTask >= waitForCPUIdle) {
                return resolve();
            }
            const timeToWait = waitForCPUIdle - timeSinceLongTask;
            lastTimeout = setTimeout(() => checkForQuiet.call(this, resolve, reject), timeToWait);
        }
        let cancel = () => {
            throw new Error('_waitForCPUIdle.cancel() called before it was defined');
        };
        const promise = new Promise((resolve, reject) => {
            log.info('Waiting for CPU to become idle');
            checkForQuiet.call(this, resolve, reject);
            cancel = () => {
                if (canceled)
                    return;
                canceled = true;
                if (lastTimeout)
                    clearTimeout(lastTimeout);
                resolve(new Error('Wait for CPU idle canceled'));
            };
        });
        return { promise, cancel };
    }
    waitForMaxTimeout(maxWaitForLoadedMs = constants_1.MAX_TRACE_WAIT_TIME) {
        return new Promise((resolve) => setTimeout(resolve, maxWaitForLoadedMs)).then(() => async () => {
            log.error('Neither network nor CPU idle time could be detected within timeout, wrapping up tracing');
            return this.completeTracing();
        });
    }
}
exports.default = TraceGatherer;
