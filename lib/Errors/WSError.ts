import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";

export class WSError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "white space";
    }

    toString() : string {
        return "WSError"; 
    }
}