"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const space_lift_1 = require("space-lift");
const MetricLcs_1 = require("../Edit/MetricLcs");
class WSError {
    rootCause() {
        return space_lift_1.None;
    }
    explanation() {
        return "white space";
    }
    minEdit(input, expectedStr) {
        return MetricLcs_1.metriclcs(input, expectedStr);
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