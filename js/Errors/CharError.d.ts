import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
export declare class CharError implements ErrorType {
    private _expectedChar;
    constructor(expectedChar: string);
    rootCause(): Option<ErrorType>;
    explanation(): string;
    toString(): string;
}