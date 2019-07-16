import { ErrorType } from "./ErrorIndex";
export declare class Translator {
    private _errorType;
    constructor(errorType: ErrorType);
    toString(): string;
}
