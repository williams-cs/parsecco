import { ErrorType } from "./ErrorType";

export abstract class Errors implements ErrorType<Errors> {
    public _error_mes : string;
    public readonly _error_type : Errors;

    constructor(error_mes : string) {
        this._error_mes = error_mes;
        this._error_type = this;
    }

    get error_mes() : string {
        return this.error_mes;
    }

    get error_type() : Errors {
        return this;
    }
}