import { CharError } from "./CharError";
import { ErrorType } from "./ErrorType";

export class BetweenLeftError extends CharError implements ErrorType<BetweenLeftError> {
    public readonly _error_type : BetweenLeftError;
    
    constructor(error_mes : string) {
        super(error_mes);
        this._error_type = this;
    }

    toString() {
        return "BetweenLeftError of " + '"' + this.error_mes + '"'; 
    }
}