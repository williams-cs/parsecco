import { ErrorType } from "../Errors/ErrorType";
export declare class Edit {
    private _input;
    private _error;
    private _output;
    constructor(input: string, error: ErrorType);
    private searchSpace;
    minEdit(): [number, string];
    alternateString(): string;
    minDist(): number;
}
