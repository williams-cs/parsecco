import { ErrorType } from "../Errors/ErrorType";
export declare class Edit {
    private _input;
    private _error;
    private _prevEdit;
    private _output;
    constructor(input: string, error: ErrorType, prevEdit?: number);
    minFix(space: string[]): [number, string];
    alternateString(): string;
    minDist(): number;
}
