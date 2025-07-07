import { InkObject } from "./Object";
export declare class VariableAssignment extends InkObject {
    readonly variableName: string | null;
    readonly isNewDeclaration: boolean;
    isGlobal: boolean;
    constructor(variableName: string | null, isNewDeclaration: boolean);
    toString(): string;
}
