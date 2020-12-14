"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowserSupported = exports.getBrowserMajorVersion = exports.isBrowserVersionLower = exports.isSupportedUrl = exports.sumByKey = exports.setUnsupportedCommand = void 0;
const constants_1 = require("./constants");
const VERSION_PROPS = ['browserVersion', 'browser_version', 'version'];
const SUPPORTED_BROWSERS_AND_MIN_VERSIONS = {
    'chrome': 63,
    'chromium': 63,
    'googlechrome': 63,
    'google chrome': 63
};
function setUnsupportedCommand(browser) {
    return browser.addCommand('cdp', () => {
        throw new Error(constants_1.UNSUPPORTED_ERROR_MESSAGE);
    });
}
exports.setUnsupportedCommand = setUnsupportedCommand;
function sumByKey(list, key) {
    return list.map((data) => data[key]).reduce((acc, val) => acc + val, 0);
}
exports.sumByKey = sumByKey;
function isSupportedUrl(url) {
    return constants_1.IGNORED_URLS.filter((ignoredUrl) => url.startsWith(ignoredUrl)).length === 0;
}
exports.isSupportedUrl = isSupportedUrl;
function isBrowserVersionLower(caps, minVersion) {
    const versionProp = VERSION_PROPS.find((prop) => caps[prop]);
    const browserVersion = getBrowserMajorVersion(caps[versionProp]);
    return typeof browserVersion === 'number' && browserVersion < minVersion;
}
exports.isBrowserVersionLower = isBrowserVersionLower;
function getBrowserMajorVersion(version) {
    if (typeof version === 'string') {
        const majorVersion = Number(version.split('.')[0]);
        return isNaN(majorVersion) ? parseInt(version, 10) : majorVersion;
    }
    return version;
}
exports.getBrowserMajorVersion = getBrowserMajorVersion;
function isBrowserSupported(caps) {
    if (!caps.browserName ||
        !(caps.browserName.toLowerCase() in SUPPORTED_BROWSERS_AND_MIN_VERSIONS) ||
        isBrowserVersionLower(caps, SUPPORTED_BROWSERS_AND_MIN_VERSIONS[caps.browserName.toLowerCase()])) {
        return false;
    }
    return true;
}
exports.isBrowserSupported = isBrowserSupported;
