"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("./Errors");
class CharError extends Errors_1.Errors {
    constructor(error_mes) {
        if (error_mes.length <= 1) {
            super(error_mes);
        }
        else {
            throw new Error("CharError expects a one-character error");
        }
        this._error_type = this;
    }
    toString() {
        return "CharError of " + '"' + this.error_mes + '"';
    }
}
exports.CharError = CharError;
//# sourceMappingURL=CharError.js.map