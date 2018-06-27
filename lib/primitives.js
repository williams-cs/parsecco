"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var charstream_1 = require("./charstream");
var Primitives;
(function (Primitives) {
    var EOFMark = /** @class */ (function () {
        function EOFMark() {
        }
        Object.defineProperty(EOFMark, "Instance", {
            get: function () {
                return this._instance || (this._instance = new this());
            },
            enumerable: true,
            configurable: true
        });
        return EOFMark;
    }());
    Primitives.EOFMark = EOFMark;
    Primitives.EOF = EOFMark.Instance;
    /**
     * Represents a successful parse.
     */
    var Success = /** @class */ (function () {
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        function Success(istream, res) {
            this.tag = "success";
            this.inputstream = istream;
            this.result = res;
        }
        return Success;
    }());
    Primitives.Success = Success;
    /**
     * Represents a failed parse.
     */
    var Failure = /** @class */ (function () {
        /**
         * Returns an object representing a failed parse.
         * @param istream The string, unmodified, that was given to the parser.
         */
        function Failure(istream) {
            this.tag = "failure";
            this.inputstream = istream;
        }
        return Failure;
    }());
    Primitives.Failure = Failure;
    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    function result(v) {
        return function (istream) { return new Success(istream, v); };
    }
    Primitives.result = result;
    /**
     * zero fails without consuming any input.
     */
    function zero() {
        return function (istream) { return new Failure(istream); };
    }
    Primitives.zero = zero;
    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails.
     */
    function item() {
        return function (istream) {
            if (istream.isEmpty()) {
                return new Failure(istream);
            }
            else {
                return new Success(istream.tail(), istream.head());
            }
        };
    }
    Primitives.item = item;
    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.  If _any_ of the parsers fail, the original inputstream
     * is returned in the Failure object (i.e., bind backtracks).
     * @param p A parser
     */
    function bind(p) {
        return function (f) {
            return function (istream) {
                var r = p(istream);
                switch (r.tag) {
                    case "success":
                        var o = f(r.result)(r.inputstream);
                        switch (o.tag) {
                            case "success": return o;
                            case "failure":
                                // note: backtracks, returning original istream
                                return new Failure(istream);
                        }
                    case "failure": return new Failure(istream);
                }
            };
        };
    }
    Primitives.bind = bind;
    /**
     * seq is a curried function that takes a parser p, a parser q,
     * and a function f. It applies p to the input, passing the
     * remaining input stream to q; q is then applied.  The function
     * f takes the result of p and q, as a tuple, and returns
     * a single result.
     * @param p A parser
     */
    function seq(p) {
        return function (q) {
            return function (f) {
                return bind(p)(function (x) {
                    return bind(q)(function (y) {
                        var tup = [x, y];
                        return result(f(tup));
                    });
                });
            };
        };
    }
    Primitives.seq = seq;
    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails.
     * @param pred a character predicate
     */
    function sat(pred) {
        var pred2 = function (cs) { return pred(cs.toString()); };
        var a = item();
        var b = function (x) {
            if (pred2(x)) {
                return result(x);
            }
            else {
                return zero();
            }
        };
        return bind(a)(b);
    }
    Primitives.sat = sat;
    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * @param c
     */
    function char(c) {
        if (c.length != 1) {
            throw new Error("char parser takes a string of length 1 (i.e., a char)");
        }
        return sat(function (x) { return x == c; });
    }
    Primitives.char = char;
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case.
     */
    function letter() {
        var contains_letter = function (x) {
            var a_letter = /[A-Za-z]/;
            return x.match(a_letter) != undefined;
        };
        return sat(contains_letter);
    }
    Primitives.letter = letter;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    function digit() {
        return sat(function (x) { return x == "0"
            || x == "1"
            || x == "2"
            || x == "3"
            || x == "4"
            || x == "5"
            || x == "6"
            || x == "7"
            || x == "8"
            || x == "9"; });
    }
    Primitives.digit = digit;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper() {
        return function (istream) {
            var o1 = letter()(istream);
            switch (o1.tag) {
                case "success":
                    var o2 = sat(function (x) { return x == x.toUpperCase(); })(o1.result);
                    switch (o2.tag) {
                        case "success":
                            return o1;
                            break;
                        case "failure":
                            return new Failure(istream);
                            break;
                    }
                    break;
                case "failure":
                    return o1;
                    break;
            }
            throw new Error("never happens");
        };
    }
    Primitives.upper = upper;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower() {
        return function (istream) {
            var o1 = letter()(istream);
            switch (o1.tag) {
                case "success":
                    var o2 = sat(function (x) { return x == x.toLowerCase(); })(o1.result);
                    switch (o2.tag) {
                        case "success":
                            return o1;
                            break;
                        case "failure":
                            return new Failure(istream);
                            break;
                    }
                    break;
                case "failure":
                    return o1;
                    break;
            }
            throw new Error("never happens");
        };
    }
    Primitives.lower = lower;
    /**
     * choice specifies an ordered choice between two parsers,
     * p1 and p2. The returned parser will first apply
     * parser p1.  If p1 succeeds, p1's Outcome is returned.
     * If p1 fails, p2 is applied and the Outcome of p2 is returned.
     * Note that the input stream given to p1 and p2 is exactly
     * the same input stream.
     * @param p1 A parser.
     */
    function choice(p1) {
        return function (p2) {
            return function (istream) {
                var o = p1(istream);
                switch (o.tag) {
                    case "success":
                        return o;
                    case "failure":
                        return p2(istream);
                }
            };
        };
    }
    Primitives.choice = choice;
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    function appfun(p) {
        return function (f) {
            return function (istream) {
                var o = p(istream);
                switch (o.tag) {
                    case "success":
                        return new Success(o.inputstream, f(o.result));
                        break;
                    case "failure":
                        return o;
                        break;
                }
            };
        };
    }
    Primitives.appfun = appfun;
    /**
     * many repeatedly applies the parser p until p fails. many always
     * succeeds, even if it matches nothing.  many tries to guard
     * against an infinite loop by raising an exception if p succeeds
     * without changing the parser state.
     * @param p
     */
    function many(p) {
        return function (istream) {
            var istream2 = istream;
            var outputs = [];
            var succeeds = true;
            while (!istream2.isEmpty() && succeeds) {
                var o = p(istream2);
                switch (o.tag) {
                    case "success":
                        if (istream2 == o.inputstream) {
                            throw new Error("Parser loops infinitely.");
                        }
                        istream2 = o.inputstream;
                        outputs.push(o.result);
                        break;
                    case "failure":
                        succeeds = false;
                        break;
                }
            }
            return new Success(istream2, outputs);
        };
    }
    Primitives.many = many;
    /**
     * many1 repeatedly applies the parser p until p fails. many1 must
     * succeed at least once.  many1 tries to guard against an infinite
     * loop by raising an exception if p succeeds without changing the
     * parser state.
     * @param p
     */
    function many1(p) {
        return function (istream) {
            return seq(p)(many(p))(function (tup) {
                var hd = tup["0"];
                var tl = tup["1"];
                tl.unshift(hd);
                return tl;
            })(istream);
        };
    }
    Primitives.many1 = many1;
    /**
     * str yields a parser for the given string.
     * @param s A string
     */
    // TODO: this should actually be a sequence of parsers constructed
    // from the string s
    function str(s) {
        return function (istream) {
            // escape regex metacharacters
            // (this likely needs work)
            var s2 = s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            var re = new RegExp("^" + s2);
            if (istream.toString().match(re)) {
                var rem = istream.substring(s.length, istream.length());
                var res = istream.substring(0, s.length);
                return new Success(rem, res);
            }
            else {
                return new Failure(istream);
            }
        };
    }
    Primitives.str = str;
    /**
     * Returns a parser that succeeds only if the end of the
     * input has been reached.
     */
    function eof() {
        return function (istream) {
            if (istream.isEOF()) {
                return new Success(istream, Primitives.EOF);
            }
            else {
                return new Failure(istream);
            }
        };
    }
    Primitives.eof = eof;
    /**
     * fresult returns a parser that applies the parser p,
     * and if p succeeds, returns the value x.
     * @param p a parser
     */
    function fresult(p) {
        return function (x) {
            return function (istream) {
                return bind(p)(function (t) { return result(x); })(istream);
            };
        };
    }
    Primitives.fresult = fresult;
    /**
     * left returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of p.
     * @param p a parser
     */
    function left(p) {
        return function (q) {
            return function (istream) {
                return bind(p)(function (t) { return fresult(q)(t); })(istream);
            };
        };
    }
    Primitives.left = left;
    /**
     * right returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of q.
     * @param p a parser
     */
    function right(p) {
        return function (q) {
            return function (istream) {
                return bind(p)(function (_) { return q; })(istream);
            };
        };
    }
    Primitives.right = right;
    /**
     * between returns a parser that applies the parser
     * popen, p, and pclose in sequence, and if all are
     * successful, returns the result of p.
     * @param popen the first parser
     */
    function between(popen) {
        return function (pclose) {
            return function (p) {
                var l = left(p)(pclose);
                var r = right(popen)(l);
                return r;
            };
        };
    }
    Primitives.between = between;
    /**
     * The debug parser takes a parser p and a debug string,
     * printing the debug string as a side-effect before
     * applying p to the input.
     * @param p a parser
     */
    function debug(p) {
        return function (label) {
            return function (istream) {
                console.log("apply: " + label);
                var o = p(istream);
                switch (o.tag) {
                    case "success":
                        console.log("success: " + label);
                        break;
                    case "failure":
                        console.log("failure: " + label);
                        break;
                }
                return o;
            };
        };
    }
    Primitives.debug = debug;
    var wschars = choice(sat(function (c) { return c == ' ' || c == '\t' || c == '\n'; }))(str('\r\n'));
    /**
     * ws matches zero or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws returns matched whitespace in a single CharStream result.
     */
    function ws() {
        return function (istream) {
            var o = many(wschars)(istream);
            switch (o.tag) {
                case "success":
                    return new Success(o.inputstream, charstream_1.CharUtil.CharStream.concat(o.result));
                // ws never fails
            }
        };
    }
    Primitives.ws = ws;
    /**
     * ws1 matches one or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws1 returns matched whitespace in a single CharStream result.
     */
    function ws1() {
        return function (istream) {
            var o = many1(wschars)(istream);
            switch (o.tag) {
                case "success":
                    return new Success(o.inputstream, charstream_1.CharUtil.CharStream.concat(o.result));
                case "failure":
                    return o;
            }
        };
    }
    Primitives.ws1 = ws1;
})(Primitives = exports.Primitives || (exports.Primitives = {}));
//# sourceMappingURL=primitives.js.map