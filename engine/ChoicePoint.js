"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoicePoint = void 0;
const Object_1 = require("./Object");
const Path_1 = require("./Path");
const NullException_1 = require("./NullException");
class ChoicePoint extends Object_1.InkObject {
    constructor(onceOnly = true) {
        super();
        this._pathOnChoice = null;
        this.hasCondition = false;
        this.hasStartContent = false;
        this.hasChoiceOnlyContent = false;
        this.isInvisibleDefault = false;
        this.onceOnly = true;
        this.onceOnly = onceOnly;
    }
    get pathOnChoice() {
        if (this._pathOnChoice != null && this._pathOnChoice.isRelative) {
            let choiceTargetObj = this.choiceTarget;
            if (choiceTargetObj) {
                this._pathOnChoice = choiceTargetObj.path;
            }
        }
        return this._pathOnChoice;
    }
    set pathOnChoice(value) {
        this._pathOnChoice = value;
    }
    get choiceTarget() {
        if (this._pathOnChoice === null)
            return (0, NullException_1.throwNullException)("ChoicePoint._pathOnChoice");
        return this.ResolvePath(this._pathOnChoice).container;
    }
    get pathStringOnChoice() {
        if (this.pathOnChoice === null)
            return (0, NullException_1.throwNullException)("ChoicePoint.pathOnChoice");
        return this.CompactPathString(this.pathOnChoice);
    }
    set pathStringOnChoice(value) {
        this.pathOnChoice = new Path_1.Path(value);
    }
    get flags() {
        let flags = 0;
        if (this.hasCondition)
            flags |= 1;
        if (this.hasStartContent)
            flags |= 2;
        if (this.hasChoiceOnlyContent)
            flags |= 4;
        if (this.isInvisibleDefault)
            flags |= 8;
        if (this.onceOnly)
            flags |= 16;
        return flags;
    }
    set flags(value) {
        this.hasCondition = (value & 1) > 0;
        this.hasStartContent = (value & 2) > 0;
        this.hasChoiceOnlyContent = (value & 4) > 0;
        this.isInvisibleDefault = (value & 8) > 0;
        this.onceOnly = (value & 16) > 0;
    }
    toString() {
        if (this.pathOnChoice === null)
            return (0, NullException_1.throwNullException)("ChoicePoint.pathOnChoice");
        // int? targetLineNum = DebugLineNumberOfPath (pathOnChoice);
        let targetLineNum = null;
        let targetString = this.pathOnChoice.toString();
        if (targetLineNum != null) {
            targetString = " line " + targetLineNum + "(" + targetString + ")";
        }
        return "Choice: -> " + targetString;
    }
}
exports.ChoicePoint = ChoicePoint;
//# sourceMappingURL=ChoicePoint.js.map