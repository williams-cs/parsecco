import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
const jslevenshtein = require('js-levenshtein');

export class DigitError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "number";
    }

    minEdit(input: string, expectedStr: string = "0") : number {
        let val: number = jslevenshtein (input, expectedStr);
        return val;
    }

    expectedStr() : string {
        return "0" ;
    }

    toString() : string {
        return "DigitError"; 
    }
}