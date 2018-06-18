"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CharStream = /** @class */ (function () {
    function CharStream(s, startpos, endpos) {
        this.input = s;
        if (startpos == undefined) {
            this.startpos = 0; // not specified; set default
        }
        else if (startpos > s.length) {
            this.startpos = s.length; // seek too far; set EOF
        }
        else {
            this.startpos = startpos; // specified and in bounds
        }
        if (endpos == undefined) {
            this.endpos = s.length; // not specified; set default
        }
        else if (endpos > s.length) {
            this.endpos = s.length; // seek too far; set EOF
        }
        else {
            this.endpos = endpos; // specified and in bounds
        }
        if (this.startpos > this.endpos) {
            this.startpos = this.endpos; // if the user flipped positions
        }
    }
    /**
     * Returns true of the end of the input has been reached.
     */
    CharStream.prototype.isEOF = function () {
        return this.startpos == this.input.length;
    };
    /**
     * Returns a Javscript primitive string of the slice of input
     * represented by this CharStream.
     */
    CharStream.prototype.toString = function () {
        return this.input.substring(this.startpos, this.endpos);
    };
    /**
     * Returns a new CharStream representing the string after
     * seeking num characters from the current position.
     * @param num
     */
    CharStream.prototype.seek = function (num) {
        if (this.startpos + num > this.endpos) {
            return new CharStream(this.input, this.endpos, this.endpos);
        }
        else {
            return new CharStream(this.input, this.startpos + num, this.endpos);
        }
    };
    /**
     * Returns a new CharStream representing the head of the input at
     * the current position.  Throws an exception if the CharStream is
     * empty.
     */
    CharStream.prototype.head = function () {
        if (!this.isEmpty()) {
            return new CharStream(this.input, this.startpos, this.startpos + 1);
        }
        else {
            throw new Error("Cannot get the head of an empty string.");
        }
    };
    /**
     * Returns a new CharStream representing the tail of the input at
     * the current position.  Throws an exception if the CharStream is
     * empty.
     */
    CharStream.prototype.tail = function () {
        if (!this.isEmpty()) {
            return new CharStream(this.input, this.startpos + 1, this.endpos);
        }
        else {
            throw new Error("Cannot get the tail of an empty string.");
        }
    };
    /**
     * Returns true if the input at the current position is empty. Note
     * that a CharStream at the end of the input contains an empty
     * string but that an empty string may not be the end-of-file (i.e.,
     * isEOF is false).
     */
    CharStream.prototype.isEmpty = function () {
        return this.startpos == this.endpos;
    };
    /**
     * Returns the number of characters in the string at
     * this position.
     */
    CharStream.prototype.length = function () {
        return this.endpos - this.startpos;
    };
    return CharStream;
}());
exports.default = CharStream;
//# sourceMappingURL=charstream.js.map