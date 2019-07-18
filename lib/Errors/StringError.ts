import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
const jslevenshtein = require('js-levenshtein');
const metriclcs = require('metric-lcs');

export class StringError implements ErrorType {
    public _expectedStr : string;

    constructor(expectedStr : string) {
        this._expectedStr = expectedStr;
    }

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "string " + " ' " + this._expectedStr + " ' "; 
    }

    minEdit(input: string, expectedStr: string) : number {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return this._expectedStr;
    }

    toString() {
        return "StringError -> " + " ' " + this._expectedStr + " ' "; 
    }
}