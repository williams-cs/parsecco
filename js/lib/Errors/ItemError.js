"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class ItemError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "";
    }
    toString() {
        return "ItemError";
    }
}
exports.ItemError = ItemError;
//# sourceMappingURL=ItemError.js.map