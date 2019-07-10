"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CharError_1 = require("./CharError");
class BetweenLeftError extends CharError_1.CharError {
    constructor(error_mes) {
        super(error_mes);
        this._error_type = this;
    }
    toString() {
        return "BetweenLeftError of " + '"' + this.error_mes + '"';
    }
}
exports.BetweenLeftError = BetweenLeftError;
//# sourceMappingURL=BetweenLeftError.js.map