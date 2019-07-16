"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
class SatError {
    constructor(expectedStr) {
        this._expectedStr = expectedStr;
    }
    rootCause() {
        return space_lift_1.None;
    }
    get errors() {
        return this._expectedStr;
    }
    explanation() {
        return "";
    }
    minEdit(input, expectedStr) {
        return 0;
    }
    expectedStr() {
        return "";
    }
    toString() {
        return "SatError -> " + this._expectedStr;
    }
}
exports.SatError = SatError;
//# sourceMappingURL=SatError.js.map