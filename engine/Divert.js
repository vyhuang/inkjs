"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Divert = void 0;
const Path_1 = require("./Path");
const PushPop_1 = require("./PushPop");
const StringBuilder_1 = require("./StringBuilder");
const Object_1 = require("./Object");
const Pointer_1 = require("./Pointer");
const Container_1 = require("./Container");
const NullException_1 = require("./NullException");
class Divert extends Object_1.InkObject {
    get targetPath() {
        if (this._targetPath != null && this._targetPath.isRelative) {
            let targetObj = this.targetPointer.Resolve();
            if (targetObj) {
                this._targetPath = targetObj.path;
            }
        }
        return this._targetPath;
    }
    set targetPath(value) {
        this._targetPath = value;
        this._targetPointer = Pointer_1.Pointer.Null;
    }
    get targetPointer() {
        if (this._targetPointer.isNull) {
            let targetObj = this.ResolvePath(this._targetPath).obj;
            if (this._targetPath === null)
                return (0, NullException_1.throwNullException)("this._targetPath");
            if (this._targetPath.lastComponent === null)
                return (0, NullException_1.throwNullException)("this._targetPath.lastComponent");
            if (this._targetPath.lastComponent.isIndex) {
                if (targetObj === null)
                    return (0, NullException_1.throwNullException)("targetObj");
                this._targetPointer.container =
                    targetObj.parent instanceof Container_1.Container ? targetObj.parent : null;
                this._targetPointer.index = this._targetPath.lastComponent.index;
            }
            else {
                this._targetPointer = Pointer_1.Pointer.StartOf(targetObj instanceof Container_1.Container ? targetObj : null);
            }
        }
        return this._targetPointer.copy();
    }
    get targetPathString() {
        if (this.targetPath == null)
            return null;
        return this.CompactPathString(this.targetPath);
    }
    set targetPathString(value) {
        if (value == null) {
            this.targetPath = null;
        }
        else {
            this.targetPath = new Path_1.Path(value);
        }
    }
    get hasVariableTarget() {
        return this.variableDivertName != null;
    }
    constructor(stackPushType) {
        super();
        this._targetPath = null;
        this._targetPointer = Pointer_1.Pointer.Null;
        this.variableDivertName = null;
        this.pushesToStack = false;
        this.stackPushType = 0;
        this.isExternal = false;
        this.externalArgs = 0;
        this.isConditional = false;
        this.pushesToStack = false;
        if (typeof stackPushType !== "undefined") {
            this.pushesToStack = true;
            this.stackPushType = stackPushType;
        }
    }
    Equals(obj) {
        let otherDivert = obj;
        if (otherDivert instanceof Divert) {
            if (this.hasVariableTarget == otherDivert.hasVariableTarget) {
                if (this.hasVariableTarget) {
                    return this.variableDivertName == otherDivert.variableDivertName;
                }
                else {
                    if (this.targetPath === null)
                        return (0, NullException_1.throwNullException)("this.targetPath");
                    return this.targetPath.Equals(otherDivert.targetPath);
                }
            }
        }
        return false;
    }
    toString() {
        if (this.hasVariableTarget) {
            return "Divert(variable: " + this.variableDivertName + ")";
        }
        else if (this.targetPath == null) {
            return "Divert(null)";
        }
        else {
            let sb = new StringBuilder_1.StringBuilder();
            let targetStr = this.targetPath.toString();
            // int? targetLineNum = DebugLineNumberOfPath (targetPath);
            let targetLineNum = null;
            if (targetLineNum != null) {
                targetStr = "line " + targetLineNum;
            }
            sb.Append("Divert");
            if (this.isConditional)
                sb.Append("?");
            if (this.pushesToStack) {
                if (this.stackPushType == PushPop_1.PushPopType.Function) {
                    sb.Append(" function");
                }
                else {
                    sb.Append(" tunnel");
                }
            }
            sb.Append(" -> ");
            sb.Append(this.targetPathString);
            sb.Append(" (");
            sb.Append(targetStr);
            sb.Append(")");
            return sb.toString();
        }
    }
}
exports.Divert = Divert;
//# sourceMappingURL=Divert.js.map