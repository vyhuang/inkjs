"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlCommand = void 0;
const Object_1 = require("./Object");
class ControlCommand extends Object_1.InkObject {
    get commandType() {
        return this._commandType;
    }
    constructor(commandType = ControlCommand.CommandType.NotSet) {
        super();
        this._commandType = commandType;
    }
    Copy() {
        return new ControlCommand(this.commandType);
    }
    static EvalStart() {
        return new ControlCommand(ControlCommand.CommandType.EvalStart);
    }
    static EvalOutput() {
        return new ControlCommand(ControlCommand.CommandType.EvalOutput);
    }
    static EvalEnd() {
        return new ControlCommand(ControlCommand.CommandType.EvalEnd);
    }
    static Duplicate() {
        return new ControlCommand(ControlCommand.CommandType.Duplicate);
    }
    static PopEvaluatedValue() {
        return new ControlCommand(ControlCommand.CommandType.PopEvaluatedValue);
    }
    static PopFunction() {
        return new ControlCommand(ControlCommand.CommandType.PopFunction);
    }
    static PopTunnel() {
        return new ControlCommand(ControlCommand.CommandType.PopTunnel);
    }
    static BeginString() {
        return new ControlCommand(ControlCommand.CommandType.BeginString);
    }
    static EndString() {
        return new ControlCommand(ControlCommand.CommandType.EndString);
    }
    static NoOp() {
        return new ControlCommand(ControlCommand.CommandType.NoOp);
    }
    static ChoiceCount() {
        return new ControlCommand(ControlCommand.CommandType.ChoiceCount);
    }
    static Turns() {
        return new ControlCommand(ControlCommand.CommandType.Turns);
    }
    static TurnsSince() {
        return new ControlCommand(ControlCommand.CommandType.TurnsSince);
    }
    static ReadCount() {
        return new ControlCommand(ControlCommand.CommandType.ReadCount);
    }
    static Random() {
        return new ControlCommand(ControlCommand.CommandType.Random);
    }
    static SeedRandom() {
        return new ControlCommand(ControlCommand.CommandType.SeedRandom);
    }
    static VisitIndex() {
        return new ControlCommand(ControlCommand.CommandType.VisitIndex);
    }
    static SequenceShuffleIndex() {
        return new ControlCommand(ControlCommand.CommandType.SequenceShuffleIndex);
    }
    static StartThread() {
        return new ControlCommand(ControlCommand.CommandType.StartThread);
    }
    static Done() {
        return new ControlCommand(ControlCommand.CommandType.Done);
    }
    static End() {
        return new ControlCommand(ControlCommand.CommandType.End);
    }
    static ListFromInt() {
        return new ControlCommand(ControlCommand.CommandType.ListFromInt);
    }
    static ListRange() {
        return new ControlCommand(ControlCommand.CommandType.ListRange);
    }
    static ListRandom() {
        return new ControlCommand(ControlCommand.CommandType.ListRandom);
    }
    static BeginTag() {
        return new ControlCommand(ControlCommand.CommandType.BeginTag);
    }
    static EndTag() {
        return new ControlCommand(ControlCommand.CommandType.EndTag);
    }
    toString() {
        return "ControlCommand " + this.commandType.toString();
    }
}
exports.ControlCommand = ControlCommand;
(function (ControlCommand) {
    let CommandType;
    (function (CommandType) {
        CommandType[CommandType["NotSet"] = -1] = "NotSet";
        CommandType[CommandType["EvalStart"] = 0] = "EvalStart";
        CommandType[CommandType["EvalOutput"] = 1] = "EvalOutput";
        CommandType[CommandType["EvalEnd"] = 2] = "EvalEnd";
        CommandType[CommandType["Duplicate"] = 3] = "Duplicate";
        CommandType[CommandType["PopEvaluatedValue"] = 4] = "PopEvaluatedValue";
        CommandType[CommandType["PopFunction"] = 5] = "PopFunction";
        CommandType[CommandType["PopTunnel"] = 6] = "PopTunnel";
        CommandType[CommandType["BeginString"] = 7] = "BeginString";
        CommandType[CommandType["EndString"] = 8] = "EndString";
        CommandType[CommandType["NoOp"] = 9] = "NoOp";
        CommandType[CommandType["ChoiceCount"] = 10] = "ChoiceCount";
        CommandType[CommandType["Turns"] = 11] = "Turns";
        CommandType[CommandType["TurnsSince"] = 12] = "TurnsSince";
        CommandType[CommandType["ReadCount"] = 13] = "ReadCount";
        CommandType[CommandType["Random"] = 14] = "Random";
        CommandType[CommandType["SeedRandom"] = 15] = "SeedRandom";
        CommandType[CommandType["VisitIndex"] = 16] = "VisitIndex";
        CommandType[CommandType["SequenceShuffleIndex"] = 17] = "SequenceShuffleIndex";
        CommandType[CommandType["StartThread"] = 18] = "StartThread";
        CommandType[CommandType["Done"] = 19] = "Done";
        CommandType[CommandType["End"] = 20] = "End";
        CommandType[CommandType["ListFromInt"] = 21] = "ListFromInt";
        CommandType[CommandType["ListRange"] = 22] = "ListRange";
        CommandType[CommandType["ListRandom"] = 23] = "ListRandom";
        CommandType[CommandType["BeginTag"] = 24] = "BeginTag";
        CommandType[CommandType["EndTag"] = 25] = "EndTag";
        CommandType[CommandType["TOTAL_VALUES"] = 26] = "TOTAL_VALUES";
    })(CommandType = ControlCommand.CommandType || (ControlCommand.CommandType = {}));
})(ControlCommand || (exports.ControlCommand = ControlCommand = {}));
//# sourceMappingURL=ControlCommand.js.map