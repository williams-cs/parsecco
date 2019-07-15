"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class CharError {
    constructor(expectedChar) {
        this._expectedChar = expectedChar;
    }
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "character " + " ' " + this._expectedChar + " ' ";
    }
    toString() {
        return "CharError -> " + " ' " + this._expectedChar + " ' ";
    }
}
exports.CharError = CharError;
//# sourceMappingURL=CharError.js.map