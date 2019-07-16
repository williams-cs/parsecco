import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";

export class ItemError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "";
    }

    toString() : string {
        return "ItemError"; 
    }
}