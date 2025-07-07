"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pointer = void 0;
const Path_1 = require("./Path");
class Pointer {
    constructor() {
        this.container = null;
        this.index = -1;
        if (arguments.length === 2) {
            this.container = arguments[0];
            this.index = arguments[1];
        }
    }
    Resolve() {
        if (this.index < 0)
            return this.container;
        if (this.container == null)
            return null;
        if (this.container.content.length == 0)
            return this.container;
        if (this.index >= this.container.content.length)
            return null;
        return this.container.content[this.index];
    }
    get isNull() {
        return this.container == null;
    }
    get path() {
        if (this.isNull)
            return null;
        if (this.index >= 0)
            return this.container.path.PathByAppendingComponent(new Path_1.Path.Component(this.index));
        else
            return this.container.path;
    }
    toString() {
        if (!this.container)
            return "Ink Pointer (null)";
        return ("Ink Pointer -> " +
            this.container.path.toString() +
            " -- index " +
            this.index);
    }
    // This method does not exist in the original C# code, but is here to maintain the
    // value semantics of Pointer.
    copy() {
        return new Pointer(this.container, this.index);
    }
    static StartOf(container) {
        return new Pointer(container, 0);
    }
    static get Null() {
        return new Pointer(null, -1);
    }
}
exports.Pointer = Pointer;
//# sourceMappingURL=Pointer.js.map