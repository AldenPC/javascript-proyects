/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriver" />
/// <reference types="webdriverio" />
import type { Viewport } from 'puppeteer-core/lib/cjs/puppeteer/common/PuppeteerViewport';
import { NETWORK_STATES } from './constants';
interface EnablePerformanceAuditsOptions {
    cacheEnabled: boolean;
    cpuThrottling: number;
    networkThrottling: keyof typeof NETWORK_STATES;
}
interface DeviceDescription {
    viewport: Viewport;
    userAgent: string;
}
export default class DevToolsService implements WebdriverIO.ServiceInstance {
    private _isSupported;
    private _shouldRunPerformanceAudits;
    private _puppeteer?;
    private _target?;
    private _page;
    private _session?;
    private _cacheEnabled?;
    private _cpuThrottling?;
    private _networkThrottling?;
    private _traceGatherer?;
    private _devtoolsGatherer?;
    private _browser?;
    beforeSession(_: WebdriverIO.Config, caps: WebDriver.DesiredCapabilities): void;
    before(caps: WebDriver.Capabilities, specs: string[], browser: WebdriverIO.BrowserObject | WebdriverIO.MultiRemoteBrowserObject): Promise<void>;
    onReload(): Promise<void>;
    beforeCommand(commandName: string, params: any[]): Promise<void>;
    afterCommand(commandName: string): Promise<void>;
    _enablePerformanceAudits({ networkThrottling, cpuThrottling, cacheEnabled }?: EnablePerformanceAuditsOptions): void;
    _disablePerformanceAudits(): void;
    _emulateDevice(device: string | DeviceDescription, inLandscape?: boolean): Promise<void>;
    _setThrottlingProfile(networkThrottling?: "Good 3G" | "offline" | "GPRS" | "Regular 2G" | "Good 2G" | "Regular 3G" | "Regular 4G" | "DSL" | "Wifi" | "online", cpuThrottling?: number, cacheEnabled?: boolean): Promise<void>;
    _setupHandler(): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map