interface CommandArgs {
    sessionId: string;
    method?: string;
    endpoint?: string;
    retries?: number;
    command?: object;
    params?: any;
}
export interface BeforeCommandArgs extends CommandArgs {
    body: any;
}
export interface AfterCommandArgs extends CommandArgs {
    result: any;
    name?: string;
}
export {};
//# sourceMappingURL=types.d.ts.map