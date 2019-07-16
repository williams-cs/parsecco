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
    minEdit(input, expectedStr) {
        return jslevenshtein(input, expectedStr);
    }
    expectedStr() {
        return " ";
    }
    toString() {
        return "LetterError";
    }
}
exports.LetterError = LetterError;
//# sourceMappingURL=LetterError.js.map