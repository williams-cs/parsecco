"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class DigitError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "number";
    }
    toString() {
        return "DigitError";
    }
}
exports.DigitError = DigitError;
//# sourceMappingURL=DigitError.js.map