import { InkObject } from "./Object";
export declare class Tag extends InkObject {
    readonly text: string;
    constructor(tagText: string);
    toString(): string;
}
