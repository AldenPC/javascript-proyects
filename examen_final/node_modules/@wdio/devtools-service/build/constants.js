"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_THROTTLE_STATE = exports.CLICK_TRANSITION = exports.NETWORK_STATES = exports.UNSUPPORTED_ERROR_MESSAGE = exports.DEFAULT_NETWORK_THROTTLING_STATE = exports.NETWORK_IDLE_TIMEOUT = exports.MAX_TRACE_WAIT_TIME = exports.CPU_IDLE_TRESHOLD = exports.TRACING_TIMEOUT = exports.FRAME_LOAD_START_TIMEOUT = exports.IGNORED_URLS = exports.DEFAULT_TRACING_CATEGORIES = void 0;
const constants_1 = require("lighthouse/lighthouse-core/config/constants");
exports.DEFAULT_TRACING_CATEGORIES = [
    '-*',
    'disabled-by-default-lighthouse',
    'v8',
    'v8.execute',
    'blink.user_timing',
    'blink.console',
    'devtools.timeline',
    'disabled-by-default-devtools.timeline',
    'disabled-by-default-devtools.screenshot',
    'disabled-by-default-devtools.timeline.stack',
    'disabled-by-default-devtools.screenshot'
];
exports.IGNORED_URLS = [
    'data:,',
    'about:',
    'chrome-extension://'
];
exports.FRAME_LOAD_START_TIMEOUT = 2000;
exports.TRACING_TIMEOUT = 10000;
exports.CPU_IDLE_TRESHOLD = 10000;
exports.MAX_TRACE_WAIT_TIME = 45000;
exports.NETWORK_IDLE_TIMEOUT = 5000;
exports.DEFAULT_NETWORK_THROTTLING_STATE = 'Good 3G';
exports.UNSUPPORTED_ERROR_MESSAGE = 'The @wdio/devtools-service currently only supports Chrome version 63 and up, and Chromium as the browserName!';
exports.NETWORK_STATES = {
    offline: {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0
    },
    GPRS: {
        offline: false,
        downloadThroughput: 50 * 1024 / 8,
        uploadThroughput: 20 * 1024 / 8,
        latency: 500
    },
    'Regular 2G': {
        offline: false,
        downloadThroughput: 250 * 1024 / 8,
        uploadThroughput: 50 * 1024 / 8,
        latency: 300
    },
    'Good 2G': {
        offline: false,
        downloadThroughput: 450 * 1024 / 8,
        uploadThroughput: 150 * 1024 / 8,
        latency: 150
    },
    'Regular 3G': {
        offline: false,
        latency: constants_1.throttling.mobileRegular3G.requestLatencyMs,
        downloadThroughput: Math.floor(constants_1.throttling.mobileRegular3G.downloadThroughputKbps * 1024 / 8),
        uploadThroughput: Math.floor(constants_1.throttling.mobileRegular3G.uploadThroughputKbps * 1024 / 8)
    },
    'Good 3G': {
        offline: false,
        latency: constants_1.throttling.mobileSlow4G.requestLatencyMs,
        downloadThroughput: Math.floor(constants_1.throttling.mobileSlow4G.downloadThroughputKbps * 1024 / 8),
        uploadThroughput: Math.floor(constants_1.throttling.mobileSlow4G.uploadThroughputKbps * 1024 / 8)
    },
    'Regular 4G': {
        offline: false,
        downloadThroughput: 4 * 1024 * 1024 / 8,
        uploadThroughput: 3 * 1024 * 1024 / 8,
        latency: 20
    },
    'DSL': {
        offline: false,
        downloadThroughput: 2 * 1024 * 1024 / 8,
        uploadThroughput: 1 * 1024 * 1024 / 8,
        latency: 5
    },
    'Wifi': {
        offline: false,
        downloadThroughput: 30 * 1024 * 1024 / 8,
        uploadThroughput: 15 * 1024 * 1024 / 8,
        latency: 2
    },
    online: {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1
    }
};
exports.CLICK_TRANSITION = 'click transition';
exports.DEFAULT_THROTTLE_STATE = {
    networkThrottling: exports.DEFAULT_NETWORK_THROTTLING_STATE,
    cpuThrottling: 4,
    cacheEnabled: false
};
