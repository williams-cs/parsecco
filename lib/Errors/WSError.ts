import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
const jslevenshtein = require('js-levenshtein');

export class WSError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "white space";
    }

    minEdit(input: string, expectedStr: string = " ") : number {
        let val: number = jslevenshtein (input, expectedStr);
        return val;
    }

    expectedStr() : string {
        return " " ;
    }

    toString() : string {
        return "WSError"; 
    }
}