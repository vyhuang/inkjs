"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopwatch = void 0;
// This is simple replacement of the Stopwatch class from the .NET Framework.
// The original class can count time with much more accuracy than the Javascript version.
// It might be worth considering using `window.performance` in the browser
// or `process.hrtime()` in node.
class Stopwatch {
    constructor() {
        this.startTime = undefined;
    }
    get ElapsedMilliseconds() {
        if (typeof this.startTime === "undefined") {
            return 0;
        }
        return new Date().getTime() - this.startTime;
    }
    Start() {
        this.startTime = new Date().getTime();
    }
    Stop() {
        this.startTime = undefined;
    }
}
exports.Stopwatch = Stopwatch;
//# sourceMappingURL=StopWatch.js.map