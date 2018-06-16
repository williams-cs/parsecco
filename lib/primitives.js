"use strict";
exports.__esModule = true;
var Primitives;
(function (Primitives) {
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
            if (istream.length == 0) {
                return new Failure(istream);
            }
            else {
                return new Success(istream.slice(1, istream.length), istream.charAt(0));
            }
        };
    }
    Primitives.item = item;
    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.
     * @param p A parser
     */
    function bind(p) {
        return function (f) {
            return function (istream) {
                var r = p(istream);
                switch (r.tag) {
                    case "success": return f(r.result)(r.inputstream);
                    case "failure": return r;
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
     * @param pred
     */
    function sat(pred) {
        var a = item();
        var b = function (x) {
            if (pred(x)) {
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
     * If p2 fails, p2 is applied and the Outcome of p2 is returned.
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
     * many repeatedly applies the parser p until p fails. many tries
     * to guard against an infinite loop by raising an exception if p
     * succeeds without changing the parser state.
     * @param p
     */
    function many(p) {
        return function (istream) {
            var istream2 = istream;
            var outputs = [];
            var succeeds = true;
            while (istream2.length > 0 && succeeds) {
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
                        break;
                }
            }
            return new Success(istream2, outputs);
        };
    }
    Primitives.many = many;
    /**
     * word yields a parser for the given string.
     * @param s A string
     */
    function word(s) {
        return function (istream) {
            var re = new RegExp("^" + s);
            if (istream.match(re)) {
                return new Success(istream.substring(s.length, istream.length), s);
            }
            else {
                return new Failure(istream);
            }
        };
    }
    Primitives.word = word;
})(Primitives = exports.Primitives || (exports.Primitives = {}));
