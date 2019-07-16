"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const jslevenshtein = require('js-levenshtein');
class ItemError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "";
    }
    minEdit(input, expectedStr) {
        return jslevenshtein(input, expectedStr);
    }
    expectedStr() {
        return "";
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map