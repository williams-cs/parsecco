"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const jslevenshtein = require('js-levenshtein');
class WSError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "white space";
    }
    minEdit(input, expectedStr) {
        return jslevenshtein(input, expectedStr);
    }
    expectedStr() {
        return " ";
    }
    toString() {
        return "WSError";
    }
}
exports.WSError = WSError;
//# sourceMappingURL=WSError.js.map