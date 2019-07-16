import { Option } from 'space-lift';
import { ErrorType } from "./ErrorType";
export declare class BetweenRightError implements ErrorType {
    private _rootCause;
    constructor(rootCause: ErrorType);
    rootCause(): Option<ErrorType>;
    explanation(): string;
    toString(): string;
}
