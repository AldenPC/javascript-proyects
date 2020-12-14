declare global {
    interface Window {
        ____lastLongTask: number;
        ____lhPerformanceObserver: PerformanceObserver;
    }
}
export default function checkTimeSinceLastLongTask(): Promise<unknown>;
//# sourceMappingURL=checkTimeSinceLastLongTask.d.ts.map