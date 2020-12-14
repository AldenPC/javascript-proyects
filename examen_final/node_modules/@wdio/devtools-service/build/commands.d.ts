/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
import 'core-js/modules/web.url';
import type { TraceEvent } from '@tracerbench/trace-event';
import type { CDPSession } from 'puppeteer-core/lib/cjs/puppeteer/common/Connection';
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';
import type { TracingOptions } from 'puppeteer-core/lib/cjs/puppeteer/common/Tracing';
import { RequestPayload } from './handler/network';
export default class CommandHandler {
    private _session;
    private _page;
    private _isTracing;
    private _networkHandler;
    private _traceEvents?;
    constructor(_session: CDPSession, _page: Page, browser: WebdriverIO.BrowserObject | WebdriverIO.MultiRemoteBrowserObject);
    cdp(domain: string, command: string, args?: {}): Promise<any>;
    getNodeId(selector: string): Promise<number>;
    getNodeIds(selector: string): Promise<number[]>;
    startTracing({ categories, path, screenshots }?: TracingOptions): Promise<void>;
    endTracing(): Promise<TraceEvent[] | undefined>;
    getTraceLogs(): TraceEvent[] | undefined;
    getPageWeight(): {
        pageWeight: number;
        transferred: number;
        requestCount: number;
        details: {
            Document?: RequestPayload | undefined;
            Stylesheet?: RequestPayload | undefined;
            Image?: RequestPayload | undefined;
            Media?: RequestPayload | undefined;
            Font?: RequestPayload | undefined;
            Script?: RequestPayload | undefined;
            TextTrack?: RequestPayload | undefined;
            XHR?: RequestPayload | undefined;
            Fetch?: RequestPayload | undefined;
            EventSource?: RequestPayload | undefined;
            WebSocket?: RequestPayload | undefined;
            Manifest?: RequestPayload | undefined;
            SignedExchange?: RequestPayload | undefined;
            Ping?: RequestPayload | undefined;
            CSPViolationReport?: RequestPayload | undefined;
            Preflight?: RequestPayload | undefined;
            Other?: RequestPayload | undefined;
        };
    };
}
//# sourceMappingURL=commands.d.ts.map