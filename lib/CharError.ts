import { ErrorType } from "./ErrorType";
import { Errors } from "./Errors";

export class CharError extends Errors implements ErrorType<CharError> {
    public readonly _error_type : CharError;

    constructor(error_mes : string) {
        if (error_mes.length <= 1) {
            super(error_mes);
        } else {
            throw new Error("CharError expects a one-character error")
        }
        this._error_type = this;
    }

    toString() : string {
        return "CharError of " + '"' + this.error_mes + '"'; 
    }
}