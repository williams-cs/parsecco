import { Option, Some, None, tuple} from 'space-lift';
import { ErrorType } from "./ErrorType";

export class BetweenRightError implements ErrorType {
    private _rootCause : ErrorType;
    
    constructor(rootCause : ErrorType) {
        this._rootCause = rootCause;
    }

    rootCause() : Option<ErrorType> {
        return Some(this._rootCause);
    }

    explanation() : string {
        return "right part";
    }

    toString() {
        return "BetweenRightError -> " + this._rootCause; 
    }
}