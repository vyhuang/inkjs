"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBuilder = void 0;
class StringBuilder {
    constructor(str) {
        str = typeof str !== "undefined" ? str.toString() : "";
        this.string = str;
    }
    get Length() {
        return this.string.length;
    }
    Append(str) {
        if (str !== null) {
            this.string += str;
        }
    }
    AppendLine(str) {
        if (typeof str !== "undefined")
            this.Append(str);
        this.string += "\n";
    }
    AppendFormat(format, ...args) {
        // taken from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
        this.string += format.replace(/{(\d+)}/g, (match, num) => typeof args[num] != "undefined" ? args[num] : match);
    }
    toString() {
        return this.string;
    }
    Clear() {
        this.string = "";
    }
}
exports.StringBuilder = StringBuilder;
//# sourceMappingURL=StringBuilder.js.map