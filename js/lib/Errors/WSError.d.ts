import { ErrorType } from "./ErrorType";
import { Option } from "space-lift";
export declare class WSError implements ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    toString(): string;
}
