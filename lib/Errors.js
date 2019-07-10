"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errors {
    constructor(error_mes) {
        this._error_mes = error_mes;
        this._error_type = this;
    }
    get error_mes() {
        return this.error_mes;
    }
    get error_type() {
        return this;
    }
}
exports.Errors = Errors;
//# sourceMappingURL=Errors.js.map