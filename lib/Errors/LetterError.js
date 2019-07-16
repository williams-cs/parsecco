"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const jslevenshtein = require('js-levenshtein');
class LetterError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "letter";
    }
    minEdit(input, expectedStr = "x") {
        let val = jslevenshtein(input, expectedStr);
        return val;
    }
    expectedStr() {
        return "x";
    }
    toString() {
        return "LetterError";
    }
}
exports.LetterError = LetterError;
//# sourceMappingURL=LetterError.js.map