"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class StringError {
    constructor(expectedStr) {
        this._expectedStr = expectedStr;
    }
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "string " + " ' " + this._expectedStr + " ' ";
    }
    toString() {
        return "StringError -> " + " ' " + this._expectedStr + " ' ";
    }
}
exports.StringError = StringError;
//# sourceMappingURL=StringError.js.map