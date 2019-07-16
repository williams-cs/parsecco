"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const jslevenshtein = require('js-levenshtein');
class DigitError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "number";
    }
    minEdit(input, expectedStr) {
        return jslevenshtein(input, expectedStr);
    }
    expectedStr() {
        return " ";
    }
    toString() {
        return "DigitError";
    }
}
exports.DigitError = DigitError;
//# sourceMappingURL=DigitError.js.map