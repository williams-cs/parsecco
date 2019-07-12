import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";

export class LetterError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "letter";
    }

    toString() : string {
        return "LetterError"; 
    }
}