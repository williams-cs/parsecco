"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Primitives;
(function (Primitives) {
    class EOFMark {
        constructor() { }
        static get Instance() {
            return this._instance || (this._instance = new this());
        }
    }
    Primitives.EOFMark = EOFMark;
    Primitives.EOF = EOFMark.Instance;
    /**
     * Represents a successful parse.
     */
    class Success {
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream, res) {
            this.tag = "success";
            this.inputstream = istream;
            this.result = res;
        }
    }
    Primitives.Success = Success;
    /**
     * Represents a failed parse.
     */
    class Failure {
        /**
         * Returns an object representing a failed parse.
         * @param istream The string, unmodified, that was given to the parser.
         */
        constructor(istream) {
            this.tag = "failure";
            this.inputstream = istream;
        }
    }
    Primitives.Failure = Failure;
    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    function result(v) {
        // return (istream) => new Success<T>(istream, v);
        return (istream) => {
            console.log("zero(), loc: " + istream.furthestFailure + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
            return new Success(istream, v);
        };
    }
    Primitives.result = result;
    /**
     * zero fails without consuming any input.
     * @param expecting the error message.
     */
    function zero(expecting) {
        return (istream) => {
            // let hwm = new HighWaterMark(istream.startpos, expecting);
            istream.furthestFailure = istream.startpos;
            console.log("zero(), loc: " + istream.furthestFailure + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
            return new Failure(istream);
        };
    }
    Primitives.zero = zero;
    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails.
     */
    function item() {
        return (istream) => {
            if (istream.isEmpty()) {
                istream.furthestFailure = istream.startpos;
                console.log("item() empty, loc: " + istream.furthestFailure);
                return new Failure(istream);
            }
            else {
                let remaining = istream.tail(); //remaing string;
                let res = istream.head(); //result of parse;
                console.log("item() success, loc: " + istream.furthestFailure);
                return new Success(remaining, res);
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
        return (f) => {
            return (istream) => {
                let r = p(istream);
                switch (r.tag) {
                    case "success":
                        let o = f(r.result)(r.inputstream);
                        switch (o.tag) {
                            case "success":
                                break;
                            case "failure": // note: backtracks, returning original istream
                                let failure_loc = o.inputstream.furthestFailure;
                                if (istream.furthestFailure != failure_loc) {
                                    console.log("bind(), istream furthest: " + istream.furthestFailure);
                                    console.log("bind(), output failure loc: " + failure_loc);
                                }
                                if (istream.furthestFailure < failure_loc) {
                                    istream.furthestFailure = failure_loc;
                                }
                                // let hwm = o.high_watermark;
                                console.log("bind(), loc: " + istream.furthestFailure);
                                return new Failure(istream);
                        }
                        return o;
                    case "failure":
                        let failure_loc = r.inputstream.furthestFailure;
                        if (istream.furthestFailure != failure_loc) {
                            console.log("bind(), istream furthest: " + istream.furthestFailure);
                            console.log("bind(), output failure loc: " + failure_loc);
                        }
                        if (istream.furthestFailure < failure_loc) {
                            istream.furthestFailure = failure_loc;
                        }
                        console.log("bind(), loc: " + istream.furthestFailure);
                        return new Failure(istream);
                }
            };
        };
    }
    Primitives.bind = bind;
    function delay(p) {
        return () => p;
    }
    Primitives.delay = delay;
    /**
     * seq is a curried function that takes a parser p, a parser q,
     * and a function f. It applies p to the input, passing the
     * remaining input stream to q; q is then applied.  The function
     * f takes the result of p and q, as a tuple, and returns
     * a single result.
     * @param p A parser
     */
    function seq(p) {
        return (q) => {
            return (f) => {
                return bind(p)((x) => {
                    return bind(q)((y) => {
                        let tup = [x, y];
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
    function sat(char_class) {
        let pred2 = (cs) => {
            // input is guaranteed to be one char
            let input = cs.toString();
            // checks if input is in the array, for some reasons != doesn't work...
            return char_class.indexOf(input) > -1;
        };
        let f = (x) => {
            console.log("sat() success, startpos: " + x.startpos + ", endpos: " + x.endpos);
            if (pred2(x)) {
                return result(x);
            }
            else {
                return (istream) => {
                    // let hwm = new HighWaterMark(istream.startpos-1, "")
                    istream.furthestFailure = istream.startpos - 1;
                    console.log("sat() failure, loc: " + istream.furthestFailure);
                    return new Failure(istream);
                };
                // return zero<CharUtil.CharStream>("next character should be one of [" + char_class.toString() + "]" );
            }
        };
        return bind(item())(f);
    }
    Primitives.sat = sat;
    function lower_chars() {
        return 'abcdefghijklmnopqrstuvwxyz'.split('');
    }
    Primitives.lower_chars = lower_chars;
    function upper_chars() {
        return 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    }
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
        return sat([c]);
    }
    Primitives.char = char;
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case.
     */
    function letter() {
        return sat(lower_chars());
    }
    Primitives.letter = letter;
    // export function letter() : IParser <CharUtil.CharStream> {
    //     return sat(lower_chars().concat(upper_chars()));
    // }
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    function digit() {
        return sat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    }
    Primitives.digit = digit;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper() {
        return sat(upper_chars());
    }
    Primitives.upper = upper;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower() {
        return sat(lower_chars());
    }
    Primitives.lower = lower;
    // /**
    //  * choice specifies an ordered choice between two parsers,
    //  * p1 and p2. The returned parser will first apply
    //  * parser p1.  If p1 succeeds, p1's Outcome is returned.
    //  * If p1 fails, p2 is applied and the Outcome of p2 is returned.
    //  * Note that the input stream given to p1 and p2 is exactly
    //  * the same input stream.
    //  * @param p1 A parser.
    //  */
    // export function choice<T>(p1: IParser<T>): (p2: IParser<T>) => IParser<T> {
    //     return (p2: IParser<T>) => {
    //         return (istream: CharUtil.CharStream) => {
    //             let o = p1(istream)
    //             switch(o.tag) {
    //                 case "success":
    //                     return o;
    //                 case "failure":
    //                     let o2 = p2(istream);
    //                     switch (o2.tag) {
    //                         case "success":
    //                             return o2;
    //                         case "failure":
    //                             // console.log("o1 inputstream: " + o.inputstream);
    //                             // console.log("o2 inputstream: " + o2.inputstream);
    //                             if (o.high_watermark.location >= o2.high_watermark.location) {
    //                                 // let hwm_a = o.high_watermark;
    //                                 console.log("choice(), hwm location: " + hwm_a.location);
    //                                 return new Failure(o2.inputstream);
    //                             } else {
    //                                 // let hwm_b = o2.high_watermark;
    //                                 console.log("choice(), hwm location: " + hwm_b.location)
    //                                 return new Failure(o2.inputstream);
    //                             }
    //                         default:
    //                             // I have no idea why TypeScript thinks we need this.
    //                             return o2;
    //                     }
    //             }
    //         };
    //     };
    // }
    // /**
    //  * appfun allows the user to apply a function f to
    //  * the result of a parser p, assuming that p is successful.
    //  * @param p A parser.  This is the same as the |>>
    //  * function from FParsec.
    //  */
    // export function appfun<T,U>(p: IParser<T>) {
    //     return (f: (t: T) => U) => {
    //         return (istream: CharUtil.CharStream) => {
    //             let o = p(istream);
    //             switch(o.tag) {
    //                 case "success":
    //                     return new Success<U>(o.inputstream, f(o.result));
    //                 case "failure":
    //                     return o;
    //             }
    //         }
    //     }
    // }
    // /**
    //  * many repeatedly applies the parser p until p fails. many always
    //  * succeeds, even if it matches nothing.  many tries to guard
    //  * against an infinite loop by raising an exception if p succeeds
    //  * without changing the parser state. 
    //  * @param p 
    //  */
    // export function many<T>(p: IParser<T>): IParser<T[]>{
    //     return (istream: CharUtil.CharStream) => {
    //         let istream2 = istream;
    //         let outputs: T[] = [];
    //         let succeeds = true;
    //         while(!istream2.isEmpty() && succeeds) {
    //             let o = p(istream2);
    //             switch(o.tag) {
    //                 case "success":
    //                     if (istream2 == o.inputstream) {
    //                         throw new Error("Parser loops infinitely.");
    //                     } 
    //                     istream2 = o.inputstream;
    //                     outputs.push(o.result);
    //                     break;
    //                 case "failure":
    //                     succeeds = false;
    //                     break;
    //             }
    //         }
    //         return new Success(istream2, outputs);
    //     }
    // }
    // /**
    //  * many1 repeatedly applies the parser p until p fails. many1 must
    //  * succeed at least once.  many1 tries to guard against an infinite
    //  * loop by raising an exception if p succeeds without changing the
    //  * parser state. 
    //  * @param p 
    //  */
    // export function many1<T>(p: IParser<T>) {
    //     return (istream: CharUtil.CharStream) => {
    //         return seq<T,T[],T[]>(p)(many<T>(p))(tup => {
    //             let hd: T = tup["0"];
    //             let tl: T[] = tup["1"];
    //             tl.unshift(hd);
    //             return tl;
    //         })(istream);
    //     };
    // }
    // /**
    //  * str yields a parser for the given string.
    //  * @param s A string
    //  */
    // export function str(s: string) : IParser<CharUtil.CharStream> {
    //     return (istream: CharUtil.CharStream) => {
    //         let chars: string[] = s.split("");
    //         let p = result(new CharUtil.CharStream(""));
    //         let f = (tup: [CharUtil.CharStream, CharUtil.CharStream]) => tup[0].concat(tup[1]);
    //         // let hack = "result()";
    //         for (var c of chars) {
    //             p = seq<CharUtil.CharStream, CharUtil.CharStream, CharUtil.CharStream>(p)(char(c))(f);
    //             // hack = "seq(" + hack + ")(char(" + c + "))";
    //         }
    //         // console.log("DEBUG! (" + chars + ")\n" + hack);
    //         return p(istream);
    //     } 
    // }
    // /**
    //  * Returns a parser that succeeds only if the end of the
    //  * input has been reached.
    //  */
    // export function eof() : IParser<EOFMark> {
    //     return (istream: CharUtil.CharStream) => {
    //         if (istream.isEOF()) {
    //             return new Success(istream, EOF);
    //         } else {
    //             // let hwm = new HighWaterMark(istream.startpos, "end of file");
    //             // let hwm = new HighWaterMark(0, "end of file");
    //             console.log("eof(), hwm loc: " + hwm.location);
    //             return new Failure(istream);
    //         }
    //     }
    // }
    // /**
    //  * fresult returns a parser that applies the parser p,
    //  * and if p succeeds, returns the value x.
    //  * @param p a parser
    //  */
    // export function fresult<T,U>(p: IParser<T>) {
    //     return (x: U) => {
    //         return (istream: CharUtil.CharStream) => {
    //             return bind<T,U>(p)((t: T) => result(x))(istream);
    //         }
    //     } 
    // }
    // /**
    //  * left returns a parser that applies the parser p,
    //  * then the parser q, and if both are successful,
    //  * returns the result of p.
    //  * @param p a parser
    //  */
    // export function left<T,U>(p: IParser<T>) {
    //     return (q: IParser<U>) => {
    //         return (istream: CharUtil.CharStream) => {
    //             return bind<T,T>(p)((t: T) => fresult<U,T>(q)(t))(istream);
    //         }
    //     }
    // }
    // /**
    //  * right returns a parser that applies the parser p,
    //  * then the parser q, and if both are successful,
    //  * returns the result of q.
    //  * @param p a parser
    //  */
    // export function right<T,U>(p: IParser<T>) {
    //     return (q: IParser<U>) => {
    //         return (istream: CharUtil.CharStream) => {
    //             return bind<T,U>(p)(_ => q)(istream);
    //         }
    //     }
    // }
    // /**
    //  * between returns a parser that applies the parser
    //  * popen, p, and pclose in sequence, and if all are
    //  * successful, returns the result of p.
    //  * @param popen the first parser
    //  */
    // export function between<T,U,V>(popen: IParser<T>): (pclose: IParser<U>) => (p: IParser<V>) => IParser<V> {
    //     return (pclose: IParser<U>) => {
    //         return (p: IParser<V>) => {
    //             let l : IParser<V> = left<V,U>(p)(pclose);
    //             let r : IParser<V> = right<T,V>(popen)(l);
    //             return r;
    //         }
    //     }
    // }
    // /**
    //  * The debug parser takes a parser p and a debug string,
    //  * printing the debug string as a side-effect before
    //  * applying p to the input.
    //  * @param p a parser
    //  */
    // export function debug<T>(p: IParser<T>) {
    //     return (label: string) => {
    //         return (istream: CharUtil.CharStream) => {
    //             console.log("apply: " + label + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
    //             let o = p(istream);
    //             switch(o.tag) {
    //                 case "success":
    //                     console.log("success: " + label + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
    //                     break;
    //                 case "failure":
    //                     console.log("failure: " + label + ", startpos: " + istream.startpos + ", endpos: " + istream.endpos);
    //                     break;
    //             }
    //             return o;
    //         }
    //     }
    // }
    // let wschars: IParser<CharUtil.CharStream> = choice(sat([' ', "\t"]))(nl());
    // /**
    //  * ws matches zero or more of the following whitespace characters:
    //  * ' ', '\t', '\n', or '\r\n'
    //  * ws returns matched whitespace in a single CharStream result.
    //  */
    // export function ws() : IParser<CharUtil.CharStream> {
    //     return (istream: CharUtil.CharStream) => {
    //         let o = many(wschars)(istream)
    //         switch(o.tag) {
    //             case "success":
    //                 return new Success(o.inputstream, CharUtil.CharStream.concat(o.result));                // ws never fails
    //             case "failure":
    //                 return o;
    //         }
    //     }
    // }
    // /**
    //  * ws1 matches one or more of the following whitespace characters:
    //  * ' ', '\t', '\n', or '\r\n'
    //  * ws1 returns matched whitespace in a single CharStream result.
    //  */
    // export function ws1() : IParser<CharUtil.CharStream> {
    //     return (istream: CharUtil.CharStream) => {
    //         let o = many1(wschars)(istream)
    //         switch(o.tag) {
    //             case "success":
    //                 return new Success(o.inputstream, CharUtil.CharStream.concat(o.result));
    //             case "failure":
    //                 return o;
    //         }
    //     }
    // }
    // /**
    //  * nl matches and returns a newline.
    //  */
    // export function nl() : IParser<CharUtil.CharStream> {
    //     return Primitives.choice(Primitives.str("\n"))(Primitives.str("\r\n"))
    // }
    // function groupBy<T,U>(list: T[], keyGetter: (e:T) => U) : Map<U,T[]> {
    //     let m: Map<U,T[]> = new Map<U,T[]>();
    //     list.forEach((item) => {
    //         const key = keyGetter(item);
    //         if (!m.has(key)) {
    //             m.set(key, []);
    //         }
    //         let collection = m.get(key)!;
    //         collection.push(item);
    //     });
    //     return m;
    // }
    // export function strSat(strs: string[]) : IParser<CharUtil.CharStream> {
    //     // sort strings first by length, and then lexicograpically;
    //     // slice() called here so as not to modify original array
    //     let smap = groupBy(strs, s => s.length);
    //     let sizes: number[] = [];
    //     // find size classes;
    //     // also sort each set of equivalent-length values
    //     smap.forEach((vals: string[], key: number, m: Map<number, string[]>) => {
    //         sizes.push(key);
    //         vals.sort();
    //     });
    //     sizes.sort();
    //     return (istream: CharUtil.CharStream) => {    
    //         // start with the smallest size class       
    //         for(let peekIndex = 0; peekIndex < sizes.length; peekIndex++) {
    //             // for each size class, try matching all of
    //             // the strings; if one is found, return the
    //             // appropriate CharStream; if not, fail.
    //             let peek = istream.peek(sizes[peekIndex]);
    //             let tail = istream.seek(sizes[peekIndex]);
    //             let candidates = smap.get(sizes[peekIndex])!;
    //             for(let cIndex = 0; cIndex < candidates.length; cIndex++) {
    //                 if (candidates[cIndex] === peek.toString()) {
    //                     return new Success(tail, peek);
    //                 }
    //             }
    //         }
    //         // return new Failure(istream, new HighWaterMark(istream.startpos, "[" + strs.toString() + "]"));
    //         return new Failure(istream);
    //     }
    // }
})(Primitives = exports.Primitives || (exports.Primitives = {}));
//# sourceMappingURL=primitives.js.map