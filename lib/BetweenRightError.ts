import { CharError } from "./CharError";
import { ErrorType } from "./ErrorType";

export class BetweenRightError extends CharError implements ErrorType<BetweenRightError> {
    public readonly _error_type : BetweenRightError;
    
    constructor(error_mes : string) {
        super(error_mes);
        this._error_type = this;
    }

    toString() {
        return "BetweenRightError of " + '"' + this.error_mes + '"'; 
    }
}