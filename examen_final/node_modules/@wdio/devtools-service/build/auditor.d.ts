/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
import type { Trace } from './gatherer/trace';
import type { CDPSessionOnMessageObject } from './gatherer/devtools';
interface Audit {
    audit: (opts: any, context: any) => Promise<any>;
    defaultOptions: Record<string, any>;
}
export default class Auditor {
    private _traceLogs?;
    private _devtoolsLogs?;
    private _url?;
    constructor(_traceLogs?: Trace | undefined, _devtoolsLogs?: CDPSessionOnMessageObject[] | undefined);
    _audit(AUDIT: Audit, params?: {}): {};
    updateCommands(browser: WebdriverIO.BrowserObject, customFn?: WebdriverIO.AddCommandFn): void;
    getMainThreadWorkBreakdown(): Promise<{
        group: string;
        duration: number;
    }[]>;
    getDiagnostics(): Promise<any>;
    getMetrics(): Promise<{
        estimatedInputLatency: number;
        timeToFirstByte: number;
        serverResponseTime: number;
        domContentLoaded: number;
        firstVisualChange: number;
        firstPaint: number;
        firstContentfulPaint: number;
        firstMeaningfulPaint: number;
        largestContentfulPaint: number;
        lastVisualChange: number;
        firstCPUIdle: number;
        firstInteractive: number;
        load: number;
        speedIndex: number;
        totalBlockingTime: number;
        cumulativeLayoutShift: number;
    }>;
    getPerformanceScore(): Promise<any>;
}
export {};
//# sourceMappingURL=auditor.d.ts.map