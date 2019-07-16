import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";

export class BetweenLeftError implements ErrorType {
    private _rootCause : ErrorType;
    
    constructor(rootCause : ErrorType) {
        this._rootCause = rootCause;
    }

    rootCause() : Option<ErrorType> {
        return Some(this._rootCause);
    }

    explanation() : string {
        return "left";
    }

    toString() {
        return "BetweenLeftError -> " + this._rootCause;
    }
}