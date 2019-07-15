"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorIndex_1 = require("./ErrorIndex");
class Translator {
    constructor(errorType) {
        this._errorType = errorType;
    }
    toString() {
        let result = "Hey, you're missing ";
        let finger = this._errorType;
        do {
            result += finger.explanation();
            result += " ";
            finger = finger.rootCause().getOrElse(new ErrorIndex_1.ItemError());
        } while (finger.rootCause().isDefined());
        result += finger.explanation();
        return result;
    }
}
exports.Translator = Translator;
//# sourceMappingURL=Translator.js.map