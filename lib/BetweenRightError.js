"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CharError_1 = require("./CharError");
class BetweenRightError extends CharError_1.CharError {
    constructor(error_mes) {
        super(error_mes);
        this._error_type = this;
    }
    toString() {
        return "BetweenRightError of " + '"' + this.error_mes + '"';
    }
}
exports.BetweenRightError = BetweenRightError;
//# sourceMappingURL=BetweenRightError.js.map