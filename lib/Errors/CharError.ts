import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";
const jslevenshtein = require('js-levenshtein');

export class CharError implements ErrorType {
    private _expectedChar : string;

    constructor(expectedChar : string) {
        this._expectedChar = expectedChar;
    }

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() {
        return "character " + " ' " + this._expectedChar + " ' "; 
    }

    minEdit(input: string, expectedStr: string) : number {
        return jslevenshtein (input, expectedStr);
    }

    expectedStr() : string {
        return this._expectedChar;
    }

    toString() : string {
        return "CharError -> " + " ' " + this._expectedChar + " ' "; 
    }
}