import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
const jslevenshtein = require('js-levenshtein');

export class LetterError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "letter";
    }

    minEdit(input: string, expectedStr: string = "x") : number {
        let val: number = jslevenshtein (input, expectedStr);
        return val;
    }

    expectedStr() : string {
        return "x" ;
    }

    toString() : string {
        return "LetterError"; 
    }
}