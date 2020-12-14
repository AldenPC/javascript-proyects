"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerPerformanceObserverInPage() {
    window.____lastLongTask = window.performance.now();
    const observer = new window.PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
            if (entry.entryType === 'longtask') {
                const taskEnd = entry.startTime + entry.duration;
                window.____lastLongTask = Math.max(window.____lastLongTask, taskEnd);
            }
        }
    });
    observer.observe({ entryTypes: ['longtask'] });
    window.____lhPerformanceObserver = observer;
}
exports.default = registerPerformanceObserverInPage;
