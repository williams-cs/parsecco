"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CharUtil;
(function (CharUtil) {
    var CharStream = /** @class */ (function () {
        function CharStream(s, startpos, endpos, hasEOF) {
            this.hasEOF = true;
            this.input = s;
            if (hasEOF != undefined) {
                this.hasEOF = hasEOF;
            }
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
            return this.hasEOF && this.startpos == this.input.length;
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
                return new CharStream(this.input, this.endpos, this.endpos, this.hasEOF);
            }
            else {
                return new CharStream(this.input, this.startpos + num, this.endpos, this.hasEOF);
            }
        };
        /**
         * Returns a new CharStream representing the head of the input at
         * the current position.  Throws an exception if the CharStream is
         * empty.
         */
        CharStream.prototype.head = function () {
            if (!this.isEmpty()) {
                var newHasEOF = this.startpos + 1 == this.endpos && this.hasEOF;
                return new CharStream(this.input, this.startpos, this.startpos + 1, newHasEOF);
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
                return new CharStream(this.input, this.startpos + 1, this.endpos, this.hasEOF);
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
         * Returns the number of characters remaining at
         * the current position.
         */
        CharStream.prototype.length = function () {
            return this.endpos - this.startpos;
        };
        /**
         * Returns the substring between start and end at the
         * current position.
         * @param start the start index of the substring, inclusive
         * @param end the end index of the substring, exclusive
         */
        CharStream.prototype.substring = function (start, end) {
            var start2 = this.startpos + start;
            var end2 = this.startpos + end;
            var newHasEOF = this.endpos == end2 && this.hasEOF;
            return new CharStream(this.input, start2, end2, newHasEOF);
        };
        /**
         * Returns the concatenation of the current CharStream with
         * the given CharStream. Note: returned object does not
         * reuse original input string, and startpos and endpos
         * are reset. If the given CharStream contains EOF, the
         * concatenated CharStream will also contain EOF.
         * @param cs the CharStream to concat to this CharStream
         */
        CharStream.prototype.concat = function (cs) {
            var s = this.toString() + cs.toString();
            return new CharStream(s, 0, s.length, cs.hasEOF);
        };
        /**
         * Concatenate an array of CharStream objects into a single
         * CharStream object.
         * @param css a CharStream[]
         */
        CharStream.concat = function (css) {
            if (css.length == 0) {
                throw new Error("CharStream array must contain at least one element.");
            }
            else {
                var cs = css[0];
                for (var i = 1; i < css.length; i++) {
                    cs = cs.concat(css[i]);
                }
                return cs;
            }
        };
        return CharStream;
    }());
    CharUtil.CharStream = CharStream;
})(CharUtil = exports.CharUtil || (exports.CharUtil = {}));
//# sourceMappingURL=charstream.js.map