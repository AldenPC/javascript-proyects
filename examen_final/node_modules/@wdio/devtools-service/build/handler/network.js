"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class NetworkHandler {
    constructor(session) {
        this.requestLog = { requests: [] };
        this.requestTypes = {};
        session.on('Network.dataReceived', this.onDataReceived.bind(this));
        session.on('Network.responseReceived', this.onNetworkResponseReceived.bind(this));
        session.on('Network.requestWillBeSent', this.onNetworkRequestWillBeSent.bind(this));
        session.on('Page.frameNavigated', this.onPageFrameNavigated.bind(this));
    }
    findRequest(params) {
        let request = this.requestLog.requests.find((req) => req.id === params.requestId);
        if (!request && this.cachedFirstRequest && this.cachedFirstRequest.id === params.requestId) {
            request = this.cachedFirstRequest;
        }
        return request;
    }
    onDataReceived(params) {
        let request = this.findRequest(params);
        if (!request || !request.type || !this.requestTypes[request.type]) {
            return;
        }
        const type = request.type;
        const requestType = this.requestTypes[type] || {};
        requestType.size += params.dataLength;
        requestType.encoded += params.encodedDataLength;
    }
    onNetworkResponseReceived(params) {
        let request = this.findRequest(params);
        if (!request) {
            return;
        }
        request.statusCode = params.response.status;
        request.requestHeaders = params.response.requestHeaders;
        request.responseHeaders = params.response.headers;
        request.timing = params.response.timing;
        request.type = params.type;
    }
    onNetworkRequestWillBeSent(params) {
        let isFirstRequestOfFrame = false;
        if (params.type === 'Document' &&
            params.initiator.type === 'other' &&
            constants_1.IGNORED_URLS.filter((url) => params.request.url.startsWith(url)).length === 0) {
            isFirstRequestOfFrame = true;
            this.requestTypes = {};
        }
        const log = {
            id: params.requestId,
            url: params.request.url,
            method: params.request.method
        };
        if (params.redirectResponse) {
            log.redirect = {
                url: params.redirectResponse.url,
                statusCode: params.redirectResponse.status,
                requestHeaders: params.redirectResponse.requestHeaders,
                responseHeaders: params.redirectResponse.headers,
                timing: params.redirectResponse.timing
            };
        }
        if (params.type) {
            const requestType = this.requestTypes[params.type];
            if (!requestType) {
                this.requestTypes[params.type] = {
                    size: 0,
                    encoded: 0,
                    count: 1
                };
            }
            else if (requestType) {
                requestType.count++;
            }
        }
        if (isFirstRequestOfFrame) {
            log.loaderId = params.loaderId;
            this.cachedFirstRequest = log;
            return;
        }
        return this.requestLog.requests.push(log);
    }
    onPageFrameNavigated(params) {
        if (!params.frame.parentId && constants_1.IGNORED_URLS.filter((url) => params.frame.url.startsWith(url)).length === 0) {
            this.requestLog = {
                id: params.frame.loaderId,
                url: params.frame.url,
                requests: []
            };
            if (this.cachedFirstRequest && this.cachedFirstRequest.loaderId === params.frame.loaderId) {
                delete this.cachedFirstRequest.loaderId;
                this.requestLog.requests.push(this.cachedFirstRequest);
                this.cachedFirstRequest = undefined;
            }
        }
    }
}
exports.default = NetworkHandler;
