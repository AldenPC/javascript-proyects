export interface CDPSessionOnMessageObject {
    id?: number;
    method: string;
    params: Record<string, unknown>;
    error: {
        message: string;
        data: any;
    };
    result?: any;
}
export default class DevtoolsGatherer {
    private _logs;
    onMessage(msgObj: CDPSessionOnMessageObject): void;
    getLogs(): CDPSessionOnMessageObject[];
}
//# sourceMappingURL=devtools.d.ts.map