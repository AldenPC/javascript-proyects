"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkTimeSinceLastLongTask() {
    return new Promise(resolve => {
        const timeoutRequested = window.performance.now() + 50;
        setTimeout(() => {
            const timeoutFired = window.performance.now();
            const timeSinceLongTask = timeoutFired - timeoutRequested < 50
                ? timeoutFired - window.____lastLongTask : 0;
            resolve(timeSinceLongTask);
        }, 50);
    });
}
exports.default = checkTimeSinceLastLongTask;
