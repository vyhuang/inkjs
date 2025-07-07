"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableReference = void 0;
const Object_1 = require("./Object");
const Path_1 = require("./Path");
class VariableReference extends Object_1.InkObject {
    get containerForCount() {
        if (this.pathForCount === null)
            return null;
        return this.ResolvePath(this.pathForCount).container;
    }
    get pathStringForCount() {
        if (this.pathForCount === null)
            return null;
        return this.CompactPathString(this.pathForCount);
    }
    set pathStringForCount(value) {
        if (value === null)
            this.pathForCount = null;
        else
            this.pathForCount = new Path_1.Path(value);
    }
    constructor(name = null) {
        super();
        this.pathForCount = null;
        this.name = name;
    }
    toString() {
        if (this.name != null) {
            return "var(" + this.name + ")";
        }
        else {
            let pathStr = this.pathStringForCount;
            return "read_count(" + pathStr + ")";
        }
    }
}
exports.VariableReference = VariableReference;
//# sourceMappingURL=VariableReference.js.map