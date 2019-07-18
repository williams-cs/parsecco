import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
export declare class SatError implements ErrorType {
    private _expectedStr;
    constructor(expectedStr: string[]);
    rootCause(): Option<ErrorType>;
    readonly errors: string[];
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
    toString(): string;
}
