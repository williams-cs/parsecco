"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const jslevenshtein = require('js-levenshtein');
const metriclcs = require('metric-lcs');
class LetterError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "letter";
    }
    minEdit(input, expectedStr) {
        return metriclcs(input, expectedStr);
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