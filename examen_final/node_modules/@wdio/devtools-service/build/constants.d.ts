export declare const DEFAULT_TRACING_CATEGORIES: string[];
export declare const IGNORED_URLS: string[];
export declare const FRAME_LOAD_START_TIMEOUT = 2000;
export declare const TRACING_TIMEOUT = 10000;
export declare const CPU_IDLE_TRESHOLD = 10000;
export declare const MAX_TRACE_WAIT_TIME = 45000;
export declare const NETWORK_IDLE_TIMEOUT = 5000;
export declare const DEFAULT_NETWORK_THROTTLING_STATE = "Good 3G";
export declare const UNSUPPORTED_ERROR_MESSAGE = "The @wdio/devtools-service currently only supports Chrome version 63 and up, and Chromium as the browserName!";
export declare const NETWORK_STATES: {
    offline: {
        offline: boolean;
        latency: number;
        downloadThroughput: number;
        uploadThroughput: number;
    };
    GPRS: {
        offline: boolean;
        downloadThroughput: number;
        uploadThroughput: number;
        latency: number;
    };
    'Regular 2G': {
        offline: boolean;
        downloadThroughput: number;
        uploadThroughput: number;
        latency: number;
    };
    'Good 2G': {
        offline: boolean;
        downloadThroughput: number;
        uploadThroughput: number;
        latency: number;
    };
    'Regular 3G': {
        offline: boolean;
        latency: any;
        downloadThroughput: number;
        uploadThroughput: number;
    };
    'Good 3G': {
        offline: boolean;
        latency: any;
        downloadThroughput: number;
        uploadThroughput: number;
    };
    'Regular 4G': {
        offline: boolean;
        downloadThroughput: number;
        uploadThroughput: number;
        latency: number;
    };
    DSL: {
        offline: boolean;
        downloadThroughput: number;
        uploadThroughput: number;
        latency: number;
    };
    Wifi: {
        offline: boolean;
        downloadThroughput: number;
        uploadThroughput: number;
        latency: number;
    };
    online: {
        offline: boolean;
        latency: number;
        downloadThroughput: number;
        uploadThroughput: number;
    };
};
export declare const CLICK_TRANSITION = "click transition";
export declare const DEFAULT_THROTTLE_STATE: {
    networkThrottling: "Good 3G" | "offline" | "GPRS" | "Regular 2G" | "Good 2G" | "Regular 3G" | "Regular 4G" | "DSL" | "Wifi" | "online";
    cpuThrottling: number;
    cacheEnabled: boolean;
};
//# sourceMappingURL=constants.d.ts.map