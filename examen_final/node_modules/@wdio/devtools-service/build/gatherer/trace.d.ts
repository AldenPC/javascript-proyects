/// <reference types="node" />
import 'core-js/modules/web.url';
import { EventEmitter } from 'events';
import type Protocol from 'devtools-protocol';
import type { TraceEvent } from '@tracerbench/trace-event';
import type { HTTPRequest } from 'puppeteer-core/lib/cjs/puppeteer/common/HTTPRequest';
import type { CDPSession } from 'puppeteer-core/lib/cjs/puppeteer/common/Connection';
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';
export interface Trace {
    traceEvents: TraceEvent[];
    frameId?: string;
    loaderId?: string;
    pageUrl?: string;
    traceStart?: number;
    traceEnd?: number;
}
export interface WaitPromise {
    promise: Promise<any>;
    cancel: Function;
}
export default class TraceGatherer extends EventEmitter {
    private _failingFrameLoadIds;
    private _pageLoadDetected;
    private _networkListeners;
    private _session;
    private _page;
    private _frameId?;
    private _loaderId?;
    private _pageUrl?;
    private _networkStatusMonitor?;
    private _trace?;
    private _traceStart?;
    private _clickTraceTimeout?;
    private _waitForNetworkIdleEvent;
    private _waitForCPUIdleEvent;
    constructor(session: CDPSession, page: Page);
    startTracing(url: string): Promise<void>;
    onFrameNavigated(msgObj: Protocol.Page.FrameNavigatedEvent): Promise<void>;
    onLoadEventFired(): Promise<void>;
    onFrameLoadFail(request: HTTPRequest): void;
    get isTracing(): boolean;
    completeTracing(): Promise<void>;
    finishTracing(): void;
    waitForNetworkIdle(session: CDPSession, networkQuietThresholdMs?: number): {
        promise: Promise<void>;
        cancel: Function;
    };
    waitForCPUIdle(waitForCPUIdle?: number): {
        promise: Promise<unknown>;
        cancel: Function;
    };
    waitForMaxTimeout(maxWaitForLoadedMs?: number): Promise<() => Promise<void>>;
}
//# sourceMappingURL=trace.d.ts.map