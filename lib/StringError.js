"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("./Errors");
class StringError extends Errors_1.Errors {
    constructor(error_mes) {
        super(error_mes);
        this._error_type = this;
    }
    toString() {
        return "StringError of " + '"' + this.error_mes + '"';
    }
}
exports.StringError = StringError;
//# sourceMappingURL=StringError.js.map