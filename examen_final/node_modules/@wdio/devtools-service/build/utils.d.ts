/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="webdriverio" />
/// <reference types="webdriver" />
import { RequestPayload } from './handler/network';
export declare function setUnsupportedCommand(browser: WebdriverIO.BrowserObject | WebdriverIO.MultiRemoteBrowserObject): void;
export declare function sumByKey(list: RequestPayload[], key: keyof RequestPayload): number;
export declare function isSupportedUrl(url: string): boolean;
export declare function isBrowserVersionLower(caps: WebDriver.Capabilities, minVersion: number): boolean;
export declare function getBrowserMajorVersion(version?: string | number): number | undefined;
export declare function isBrowserSupported(caps: WebDriver.Capabilities): boolean;
//# sourceMappingURL=utils.d.ts.map