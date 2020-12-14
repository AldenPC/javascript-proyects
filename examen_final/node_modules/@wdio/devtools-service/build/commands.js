"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/modules/web.url");
const logger_1 = __importDefault(require("@wdio/logger"));
const network_1 = __importDefault(require("./handler/network"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const log = logger_1.default('@wdio/devtools-service:CommandHandler');
class CommandHandler {
    constructor(_session, _page, browser) {
        this._session = _session;
        this._page = _page;
        this._isTracing = false;
        this._session = _session;
        this._page = _page;
        this._networkHandler = new network_1.default(_session);
        const commands = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(fnName => fnName !== 'constructor' && !fnName.startsWith('_'));
        commands.forEach(fnName => browser.addCommand(fnName, this[fnName].bind(this)));
    }
    cdp(domain, command, args = {}) {
        log.info(`Send command "${domain}.${command}" with args: ${JSON.stringify(args)}`);
        return this._session.send(`${domain}.${command}`, args);
    }
    async getNodeId(selector) {
        const document = await this._session.send('DOM.getDocument');
        const { nodeId } = await this._session.send('DOM.querySelector', { nodeId: document.root.nodeId, selector });
        return nodeId;
    }
    async getNodeIds(selector) {
        const document = await this._session.send('DOM.getDocument');
        const { nodeIds } = await this._session.send('DOM.querySelectorAll', { nodeId: document.root.nodeId, selector });
        return nodeIds;
    }
    startTracing({ categories = constants_1.DEFAULT_TRACING_CATEGORIES, path, screenshots = true } = {}) {
        if (this._isTracing) {
            throw new Error('browser is already being traced');
        }
        this._isTracing = true;
        this._traceEvents = undefined;
        return this._page.tracing.start({ categories, path, screenshots });
    }
    async endTracing() {
        if (!this._isTracing) {
            throw new Error('No tracing was initiated, call `browser.startTracing()` first');
        }
        try {
            const traceBuffer = await this._page.tracing.stop();
            this._traceEvents = JSON.parse(traceBuffer.toString('utf8'));
            this._isTracing = false;
        }
        catch (err) {
            throw new Error(`Couldn't parse trace events: ${err.message}`);
        }
        return this._traceEvents;
    }
    getTraceLogs() {
        return this._traceEvents;
    }
    getPageWeight() {
        const requestTypes = Object.values(this._networkHandler.requestTypes).filter(Boolean);
        const pageWeight = utils_1.sumByKey(requestTypes, 'size');
        const transferred = utils_1.sumByKey(requestTypes, 'encoded');
        const requestCount = utils_1.sumByKey(requestTypes, 'count');
        return { pageWeight, transferred, requestCount, details: this._networkHandler.requestTypes };
    }
}
exports.default = CommandHandler;
