"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@wdio/logger"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const commands_1 = __importDefault(require("./commands"));
const auditor_1 = __importDefault(require("./auditor"));
const trace_1 = __importDefault(require("./gatherer/trace"));
const devtools_1 = __importDefault(require("./gatherer/devtools"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const log = logger_1.default('@wdio/devtools-service');
const TRACE_COMMANDS = ['click', 'navigateTo', 'url'];
class DevToolsService {
    constructor() {
        this._isSupported = false;
        this._shouldRunPerformanceAudits = false;
        this._page = null;
    }
    beforeSession(_, caps) {
        if (!utils_1.isBrowserSupported(caps)) {
            return log.error(constants_1.UNSUPPORTED_ERROR_MESSAGE);
        }
        this._isSupported = true;
    }
    before(caps, specs, browser) {
        this._browser = browser;
        this._isSupported = this._isSupported || Boolean(this._browser.puppeteer);
        return this._setupHandler();
    }
    async onReload() {
        if (!this._browser) {
            return;
        }
        this._browser.puppeteer = null;
        return this._setupHandler();
    }
    async beforeCommand(commandName, params) {
        if (!this._shouldRunPerformanceAudits || !this._traceGatherer || this._traceGatherer.isTracing || !TRACE_COMMANDS.includes(commandName)) {
            return;
        }
        this._setThrottlingProfile(this._networkThrottling, this._cpuThrottling, this._cacheEnabled);
        const url = ['url', 'navigateTo'].some(cmdName => cmdName === commandName)
            ? params[0]
            : constants_1.CLICK_TRANSITION;
        return this._traceGatherer.startTracing(url);
    }
    async afterCommand(commandName) {
        if (!this._traceGatherer || !this._traceGatherer.isTracing || !TRACE_COMMANDS.includes(commandName)) {
            return;
        }
        this._traceGatherer.once('tracingComplete', (traceEvents) => {
            var _a;
            const auditor = new auditor_1.default(traceEvents, (_a = this._devtoolsGatherer) === null || _a === void 0 ? void 0 : _a.getLogs());
            auditor.updateCommands(this._browser);
        });
        this._traceGatherer.once('tracingError', (err) => {
            const auditor = new auditor_1.default();
            auditor.updateCommands(this._browser, () => {
                throw new Error(`Couldn't capture performance due to: ${err.message}`);
            });
        });
        return new Promise((resolve) => {
            var _a;
            log.info(`Wait until tracing for command ${commandName} finishes`);
            (_a = this._traceGatherer) === null || _a === void 0 ? void 0 : _a.once('tracingFinished', async () => {
                log.info('Disable throttling');
                await this._setThrottlingProfile('online', 0, true);
                log.info('continuing with next WebDriver command');
                resolve();
            });
        });
    }
    _enablePerformanceAudits({ networkThrottling, cpuThrottling, cacheEnabled } = constants_1.DEFAULT_THROTTLE_STATE) {
        if (!constants_1.NETWORK_STATES[networkThrottling]) {
            throw new Error(`Network throttling profile "${networkThrottling}" is unknown, choose between ${Object.keys(constants_1.NETWORK_STATES).join(', ')}`);
        }
        if (typeof cpuThrottling !== 'number') {
            throw new Error(`CPU throttling rate needs to be typeof number but was "${typeof cpuThrottling}"`);
        }
        this._networkThrottling = networkThrottling;
        this._cpuThrottling = cpuThrottling;
        this._cacheEnabled = Boolean(cacheEnabled);
        this._shouldRunPerformanceAudits = true;
    }
    _disablePerformanceAudits() {
        this._shouldRunPerformanceAudits = false;
    }
    async _emulateDevice(device, inLandscape) {
        if (!this._page) {
            throw new Error('No page has been captured yet');
        }
        if (typeof device === 'string') {
            const deviceName = device + (inLandscape ? ' landscape' : '');
            const deviceCapabilities = puppeteer_core_1.default.devices[deviceName];
            if (!deviceCapabilities) {
                const deviceNames = puppeteer_core_1.default.devices
                    .map((device) => device.name)
                    .filter((device) => !device.endsWith('landscape'));
                throw new Error(`Unknown device, available options: ${deviceNames.join(', ')}`);
            }
            return this._page.emulate(deviceCapabilities);
        }
        return this._page.emulate(device);
    }
    async _setThrottlingProfile(networkThrottling = constants_1.DEFAULT_THROTTLE_STATE.networkThrottling, cpuThrottling = constants_1.DEFAULT_THROTTLE_STATE.cpuThrottling, cacheEnabled = constants_1.DEFAULT_THROTTLE_STATE.cacheEnabled) {
        if (!this._page || !this._session) {
            throw new Error('No page or session has been captured yet');
        }
        await this._page.setCacheEnabled(Boolean(cacheEnabled));
        await this._session.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottling });
        await this._session.send('Network.emulateNetworkConditions', constants_1.NETWORK_STATES[networkThrottling]);
    }
    async _setupHandler() {
        if (!this._isSupported || !this._browser) {
            return utils_1.setUnsupportedCommand(this._browser);
        }
        this._puppeteer = await this._browser.getPuppeteer();
        if (!this._puppeteer) {
            throw new Error('Could not initiate Puppeteer instance');
        }
        this._target = await this._puppeteer.waitForTarget((t) => t.type() === 'page');
        if (!this._target) {
            throw new Error('No page target found');
        }
        this._page = await this._target.page();
        if (!this._page) {
            throw new Error('No page found');
        }
        this._session = await this._target.createCDPSession();
        new commands_1.default(this._session, this._page, this._browser);
        this._traceGatherer = new trace_1.default(this._session, this._page);
        this._session.on('Page.loadEventFired', this._traceGatherer.onLoadEventFired.bind(this._traceGatherer));
        this._session.on('Page.frameNavigated', this._traceGatherer.onFrameNavigated.bind(this._traceGatherer));
        this._page.on('requestfailed', this._traceGatherer.onFrameLoadFail.bind(this._traceGatherer));
        await Promise.all(['Page', 'Network', 'Console'].map((domain) => {
            var _a;
            return Promise.all([
                (_a = this._session) === null || _a === void 0 ? void 0 : _a.send(`${domain}.enable`)
            ]);
        }));
        this._devtoolsGatherer = new devtools_1.default();
        this._puppeteer['_connection']._transport._ws.addEventListener('message', (event) => {
            var _a;
            const data = JSON.parse(event.data);
            (_a = this._devtoolsGatherer) === null || _a === void 0 ? void 0 : _a.onMessage(data);
            const method = data.method || 'event';
            log.debug(`cdp event: ${method} with params ${JSON.stringify(data.params)}`);
            if (this._browser) {
                this._browser.emit(method, data.params);
            }
        });
        this._browser.addCommand('enablePerformanceAudits', this._enablePerformanceAudits.bind(this));
        this._browser.addCommand('disablePerformanceAudits', this._disablePerformanceAudits.bind(this));
        this._browser.addCommand('emulateDevice', this._emulateDevice.bind(this));
    }
}
exports.default = DevToolsService;
