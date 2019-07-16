import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";

export class LetterError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "letter";
    }

    fix() : string[] {
        return ["a","b","c","d","e","f","g","h","i","j","k","l","m",
                "n","o","p","q","r","s","t","u","v","w","x","y","z"];
    }
    toString() : string {
        return "LetterError"; 
    }
}