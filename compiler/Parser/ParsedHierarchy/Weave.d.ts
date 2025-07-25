import { Container as RuntimeContainer } from "../../../engine/Container";
import { Gather } from "./Gather/Gather";
import { GatherPointToResolve } from "./Gather/GatherPointToResolve";
import { IWeavePoint } from "./IWeavePoint";
import { ParsedObject } from "./Object";
import { InkObject as RuntimeObject } from "../../../engine/Object";
import { Story } from "./Story";
type BadTerminationHandler = (terminatingObj: ParsedObject) => void;
export declare class Weave extends ParsedObject {
    get rootContainer(): RuntimeContainer;
    previousWeavePoint: IWeavePoint | null;
    addContentToPreviousWeavePoint: boolean;
    hasSeenChoiceInSection: boolean;
    currentContainer: RuntimeContainer | null;
    baseIndentIndex: number;
    private _unnamedGatherCount;
    private _choiceCount;
    private _rootContainer;
    private _namedWeavePoints;
    get namedWeavePoints(): Map<string, IWeavePoint>;
    looseEnds: IWeavePoint[];
    gatherPointsToResolve: GatherPointToResolve[];
    get lastParsedSignificantObject(): ParsedObject | null;
    constructor(cont: ParsedObject[], indentIndex?: number);
    get typeName(): string;
    readonly ResolveWeavePointNaming: () => void;
    readonly ConstructWeaveHierarchyFromIndentation: () => void;
    readonly DetermineBaseIndentationFromContent: (contentList: ParsedObject[]) => number;
    readonly GenerateRuntimeObject: () => RuntimeContainer;
    readonly AddRuntimeForGather: (gather: Gather) => void;
    readonly AddRuntimeForWeavePoint: (weavePoint: IWeavePoint) => void;
    readonly AddRuntimeForNestedWeave: (nestedResult: Weave) => void;
    readonly AddGeneralRuntimeContent: (content: RuntimeObject) => void;
    readonly PassLooseEndsToAncestors: () => void;
    readonly ReceiveLooseEnd: (childWeaveLooseEnd: IWeavePoint) => void;
    ResolveReferences(context: Story): void;
    readonly WeavePointNamed: (name: string) => IWeavePoint | null;
    readonly IsGlobalDeclaration: (obj: ParsedObject) => boolean;
    readonly ContentThatFollowsWeavePoint: (weavePoint: IWeavePoint) => ParsedObject[];
    readonly ValidateTermination: (badTerminationHandler: BadTerminationHandler) => void;
    readonly BadNestedTerminationHandler: BadTerminationHandler;
    readonly ValidateFlowOfObjectsTerminates: (objFlow: ParsedObject[], defaultObj: ParsedObject, badTerminationHandler: BadTerminationHandler) => void;
    readonly WeavePointHasLooseEnd: (weavePoint: IWeavePoint) => boolean;
    readonly CheckForWeavePointNamingCollisions: () => void;
}
export {};
