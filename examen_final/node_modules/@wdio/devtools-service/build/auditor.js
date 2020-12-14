"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diagnostics_1 = __importDefault(require("lighthouse/lighthouse-core/audits/diagnostics"));
const mainthread_work_breakdown_1 = __importDefault(require("lighthouse/lighthouse-core/audits/mainthread-work-breakdown"));
const metrics_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics"));
const server_response_time_1 = __importDefault(require("lighthouse/lighthouse-core/audits/server-response-time"));
const cumulative_layout_shift_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics/cumulative-layout-shift"));
const first_contentful_paint_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics/first-contentful-paint"));
const largest_contentful_paint_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics/largest-contentful-paint"));
const speed_index_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics/speed-index"));
const interactive_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics/interactive"));
const total_blocking_time_1 = __importDefault(require("lighthouse/lighthouse-core/audits/metrics/total-blocking-time"));
const scoring_1 = __importDefault(require("lighthouse/lighthouse-core/scoring"));
const default_config_1 = __importDefault(require("lighthouse/lighthouse-core/config/default-config"));
const logger_1 = __importDefault(require("@wdio/logger"));
const log = logger_1.default('@wdio/devtools-service:Auditor');
const SHARED_AUDIT_CONTEXT = {
    settings: { throttlingMethod: 'devtools' },
    LighthouseRunWarnings: false,
    computedCache: new Map()
};
class Auditor {
    constructor(_traceLogs, _devtoolsLogs) {
        this._traceLogs = _traceLogs;
        this._devtoolsLogs = _devtoolsLogs;
        this._devtoolsLogs = _devtoolsLogs;
        this._traceLogs = _traceLogs;
        if (_traceLogs) {
            this._url = _traceLogs.pageUrl;
        }
    }
    _audit(AUDIT, params = {}) {
        const auditContext = {
            options: { ...AUDIT.defaultOptions },
            ...SHARED_AUDIT_CONTEXT
        };
        try {
            return AUDIT.audit({
                traces: { defaultPass: this._traceLogs },
                devtoolsLogs: { defaultPass: this._devtoolsLogs },
                TestedAsMobileDevice: true,
                ...params
            }, auditContext);
        }
        catch (e) {
            log.error(e);
            return {};
        }
    }
    updateCommands(browser, customFn) {
        const commands = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(fnName => fnName !== 'constructor' && fnName !== 'updateCommands' && !fnName.startsWith('_'));
        commands.forEach(fnName => browser.addCommand(fnName, customFn || this[fnName].bind(this)));
    }
    async getMainThreadWorkBreakdown() {
        const result = await this._audit(mainthread_work_breakdown_1.default);
        return result.details.items.map(({ group, duration }) => ({ group, duration }));
    }
    async getDiagnostics() {
        const result = await this._audit(diagnostics_1.default);
        if (!Object.prototype.hasOwnProperty.call(result, 'details')) {
            return null;
        }
        return result.details.items[0];
    }
    async getMetrics() {
        const serverResponseTime = await this._audit(server_response_time_1.default, { URL: this._url });
        const cumulativeLayoutShift = await this._audit(cumulative_layout_shift_1.default);
        const result = await this._audit(metrics_1.default);
        const metrics = result.details.items[0] || {};
        return {
            estimatedInputLatency: metrics.estimatedInputLatency,
            timeToFirstByte: Math.round(serverResponseTime.numericValue),
            serverResponseTime: Math.round(serverResponseTime.numericValue),
            domContentLoaded: metrics.observedDomContentLoaded,
            firstVisualChange: metrics.observedFirstVisualChange,
            firstPaint: metrics.observedFirstPaint,
            firstContentfulPaint: metrics.firstContentfulPaint,
            firstMeaningfulPaint: metrics.firstMeaningfulPaint,
            largestContentfulPaint: metrics.largestContentfulPaint,
            lastVisualChange: metrics.observedLastVisualChange,
            firstCPUIdle: metrics.firstCPUIdle,
            firstInteractive: metrics.interactive,
            load: metrics.observedLoad,
            speedIndex: metrics.speedIndex,
            totalBlockingTime: metrics.totalBlockingTime,
            cumulativeLayoutShift: cumulativeLayoutShift.numericValue,
        };
    }
    async getPerformanceScore() {
        const auditResults = {
            'speed-index': await this._audit(speed_index_1.default),
            'first-contentful-paint': await this._audit(first_contentful_paint_1.default),
            'largest-contentful-paint': await this._audit(largest_contentful_paint_1.default),
            'cumulative-layout-shift': await this._audit(cumulative_layout_shift_1.default),
            'total-blocking-time': await this._audit(total_blocking_time_1.default),
            interactive: await this._audit(interactive_1.default)
        };
        if (!auditResults.interactive || !auditResults['cumulative-layout-shift'] || !auditResults['first-contentful-paint'] ||
            !auditResults['largest-contentful-paint'] || !auditResults['speed-index'] || !auditResults['total-blocking-time']) {
            log.info('One or multiple required metrics couldn\'t be found, setting performance score to: null');
            return null;
        }
        const scores = default_config_1.default.categories.performance.auditRefs.filter((auditRef) => auditRef.weight).map((auditRef) => ({
            score: auditResults[auditRef.id].score,
            weight: auditRef.weight,
        }));
        return scoring_1.default.arithmeticMean(scores);
    }
}
exports.default = Auditor;
