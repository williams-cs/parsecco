"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class BetweenLeftError {
    constructor(rootCause) {
        this._rootCause = rootCause;
    }
    rootCause() {
        return space_lift_1.Some(this._rootCause);
    }
    explanation() {
        return "left";
    }
    minEdit(input, expectedStr) {
        return this._rootCause.minEdit(input, expectedStr);
    }
    expectedStr() {
        return "(";
    }
    toString() {
        return "BetweenLeftError -> " + this._rootCause;
    }
}
exports.BetweenLeftError = BetweenLeftError;
//# sourceMappingURL=BetweenLeftError.js.map