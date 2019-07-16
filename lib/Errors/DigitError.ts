import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";

export class DigitError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "number";
    }

    toString() : string {
        return "DigitError"; 
    }
}