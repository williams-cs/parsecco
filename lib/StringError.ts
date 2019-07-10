import { ErrorType } from "./ErrorType";
import { Errors } from "./Errors";

export class StringError extends Errors implements ErrorType<StringError> {
    public readonly _error_type : StringError;

    constructor(error_mes : string) {
        super(error_mes);
        this._error_type = this;
    }

    toString() {
        return "StringError of " + '"' + this.error_mes + '"'; 
    }

}