"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Levenshtein_1 = require("./Levenshtein");
const jslevenshtein = require('js-levenshtein');
class Edit {
    constructor(input, error, prevEdit = 0) {
        this._input = input;
        this._error = error;
        this._prevEdit = prevEdit;
        this._output = [0, ""];
    }
    /*
    Given a particular error, it creates a finite
    space of most possible error correcting replacements.
    All of items in the search space are possible fixes
    to the error
    */
    // private searchSpace(error: ErrorType): string[]{
    //     return error.fix();
    // }
    /*
    Returns the minimum edit distance of a string that
    fixes the error, and returns that string. The complexity
    is O(kmn), where k is the size of the search space.
    Returns a tuple of the minimum edit distance and
    alternate string associated
    */
    minFix(space) {
        let min = Levenshtein_1.levenshteinDist(this._input, space[0]);
        let closestStr = space[0];
        for (let str in space) {
            let curr = Levenshtein_1.levenshteinDist(this._input, str);
            if (curr < min) {
                min = curr;
                closestStr = str;
            }
            if (min == 1) {
                break;
            }
        }
        this._output = [min + this._prevEdit, closestStr];
        return this._output;
    }
    // Not sure if necessary given that minEdit needs to run before these can be called
    /*
    Returns the alternate string that satisfied the
    error. Requires a call of minEdit()
    */
    alternateString() {
        return this._output[1];
    }
    /*
    Returns the distance of the minimum edit
    */
    minDist() {
        return this._output[0];
    }
}
exports.Edit = Edit;
//# sourceMappingURL=Edit.js.map