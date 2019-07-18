import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
const jslevenshtein = require('js-levenshtein');
const metriclcs = require('metric-lcs');

export class WSError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "white space";
    }

    minEdit(input: string, expectedStr: string) : number {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return " " ;
    }

    toString() : string {
        return "WSError"; 
    }
}