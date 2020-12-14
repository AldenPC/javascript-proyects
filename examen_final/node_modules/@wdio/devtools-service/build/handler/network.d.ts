import type { CDPSession } from 'puppeteer-core/lib/cjs/puppeteer/common/Connection';
import type Protocol from 'devtools-protocol';
interface RequestLog {
    id?: string;
    url?: string;
    requests: Request[];
}
interface Request {
    id: string;
    url: string;
    method: string;
    loaderId?: string;
    statusCode?: number;
    requestHeaders?: Protocol.Network.Headers;
    responseHeaders?: Protocol.Network.Headers;
    timing?: Protocol.Network.ResourceTiming;
    type?: Protocol.Network.ResourceType;
    redirect?: {
        url: string;
        statusCode: number;
        requestHeaders?: Protocol.Network.Headers;
        responseHeaders?: Protocol.Network.Headers;
        timing?: Protocol.Network.ResourceTiming;
    };
}
export interface RequestPayload {
    size: number;
    encoded: number;
    count: number;
}
export default class NetworkHandler {
    requestLog: RequestLog;
    requestTypes: {
        [key in Protocol.Network.ResourceType]?: RequestPayload;
    };
    cachedFirstRequest?: Request;
    constructor(session: CDPSession);
    findRequest(params: Protocol.Network.DataReceivedEvent | Protocol.Network.ResponseReceivedEvent): Request | undefined;
    onDataReceived(params: Protocol.Network.DataReceivedEvent): void;
    onNetworkResponseReceived(params: Protocol.Network.ResponseReceivedEvent): void;
    onNetworkRequestWillBeSent(params: Protocol.Network.RequestWillBeSentEvent): number | undefined;
    onPageFrameNavigated(params: Protocol.Page.FrameNavigatedEvent): void;
}
export {};
//# sourceMappingURL=network.d.ts.map