"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class BetweenRightError {
    constructor(rootCause) {
        this._rootCause = rootCause;
    }
    rootCause() {
        return space_lift_1.Some(this._rootCause);
    }
    explanation() {
        return "right part";
    }
    minEdit(input, expectedStr = "") {
        return this._rootCause.minEdit(input, expectedStr);
    }
    expectedStr() {
        return ")";
    }
    toString() {
        return "BetweenRightError -> " + this._rootCause;
    }
}
exports.BetweenRightError = BetweenRightError;
//# sourceMappingURL=BetweenRightError.js.map