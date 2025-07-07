import { Path } from "./Path";
import { Container } from "./Container";
import { InkObject } from "./Object";
export declare class Pointer {
    container: Container | null;
    index: number;
    constructor();
    constructor(container: Container | null, index: number);
    Resolve(): InkObject | null;
    get isNull(): boolean;
    get path(): Path | null;
    toString(): string;
    copy(): Pointer;
    static StartOf(container: Container | null): Pointer;
    static get Null(): Pointer;
}
