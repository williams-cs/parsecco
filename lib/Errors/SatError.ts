import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";

export class SatError implements ErrorType {
    private _expectedStr : string[];

    constructor(expectedStr : string[]) {
        this._expectedStr = expectedStr;
    }

    rootCause() : Option<ErrorType> {
        return None;
    }

    get errors() : string[] {
        return this._expectedStr;
    }

    explanation() {
        return "";
    }

    toString() {
        return "SatError -> " + this._expectedStr; 
    }
}