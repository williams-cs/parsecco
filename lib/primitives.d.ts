import { CharUtil } from "./charstream";
export declare namespace Primitives {
    class EOFMark {
        private static _instance;
        private constructor();
        static readonly Instance: EOFMark;
    }
    const EOF: EOFMark;
    /**
     * Represents a successful parse.
     */
    class Success<T> {
        tag: "success";
        result: T;
        inputstream: CharUtil.CharStream;
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream: CharUtil.CharStream, res: T);
    }
    /**
     * Represents a failed parse.
     */
    class Failure {
        tag: "failure";
        inputstream: CharUtil.CharStream;
        /**
         * Returns an object representing a failed parse.
         * @param istream The string, unmodified, that was given to the parser.
         */
        constructor(istream: CharUtil.CharStream);
    }
    /**
     * Union type representing a successful or failed parse.
     */
    type Outcome<T> = Success<T> | Failure;
    /**
     * Generic type of a parser.
     */
    interface IParser<T> {
        (inputstream: CharUtil.CharStream): Outcome<T>;
    }
    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    function result<T>(v: T): IParser<T>;
    /**
     * zero fails without consuming any input.
     */
    function zero<T>(): IParser<T>;
    /**
     * item successfully consumes the first character if the input
     * string is non-empty, otherwise it fails.
     */
    function item(): (istream: CharUtil.CharStream) => Outcome<CharUtil.CharStream>;
    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.  If _any_ of the parsers fail, the original inputstream
     * is returned in the Failure object (i.e., bind backtracks).
     * @param p A parser
     */
    function bind<T, U>(p: IParser<T>): (f: (t: T) => IParser<U>) => (istream: CharUtil.CharStream) => Outcome<U>;
    /**
     * seq is a curried function that takes a parser p, a parser q,
     * and a function f. It applies p to the input, passing the
     * remaining input stream to q; q is then applied.  The function
     * f takes the result of p and q, as a tuple, and returns
     * a single result.
     * @param p A parser
     */
    function seq<T, U, V>(p: IParser<T>): (q: IParser<U>) => (f: (e: [T, U]) => V) => (istream: CharUtil.CharStream) => Outcome<V>;
    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails.
     * @param pred a character predicate
     */
    function sat(pred: (s: string) => boolean): IParser<CharUtil.CharStream>;
    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * @param c
     */
    function char(c: string): IParser<CharUtil.CharStream>;
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case.
     */
    function letter(): IParser<CharUtil.CharStream>;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    function digit(): IParser<CharUtil.CharStream>;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper(): IParser<CharUtil.CharStream>;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower(): IParser<CharUtil.CharStream>;
    /**
     * choice specifies an ordered choice between two parsers,
     * p1 and p2. The returned parser will first apply
     * parser p1.  If p1 succeeds, p1's Outcome is returned.
     * If p1 fails, p2 is applied and the Outcome of p2 is returned.
     * Note that the input stream given to p1 and p2 is exactly
     * the same input stream.
     * @param p1 A parser.
     */
    function choice<T>(p1: IParser<T>): (p2: IParser<T>) => (istream: CharUtil.CharStream) => Outcome<T>;
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    function appfun<T, U>(p: IParser<T>): (f: (t: T) => U) => (istream: CharUtil.CharStream) => Failure | Success<U>;
    /**
     * many repeatedly applies the parser p until p fails. many always
     * succeeds, even if it matches nothing.  many tries to guard
     * against an infinite loop by raising an exception if p succeeds
     * without changing the parser state.
     * @param p
     */
    function many<T>(p: IParser<T>): (istream: CharUtil.CharStream) => Success<T[]>;
    /**
     * many1 repeatedly applies the parser p until p fails. many1 must
     * succeed at least once.  many1 tries to guard against an infinite
     * loop by raising an exception if p succeeds without changing the
     * parser state.
     * @param p
     */
    function many1<T>(p: IParser<T>): (istream: CharUtil.CharStream) => Outcome<T[]>;
    /**
     * str yields a parser for the given string.
     * @param s A string
     */
    function str(s: string): IParser<CharUtil.CharStream>;
    /**
     * Returns a parser that succeeds only if the end of the
     * input has been reached.
     */
    function eof(): IParser<EOFMark>;
    /**
     * fresult returns a parser that applies the parser p,
     * and if p succeeds, returns the value x.
     * @param p a parser
     */
    function fresult<T, U>(p: IParser<T>): (x: U) => (istream: CharUtil.CharStream) => Outcome<U>;
    /**
     * left returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of p.
     * @param p a parser
     */
    function left<T, U>(p: IParser<T>): (q: IParser<U>) => (istream: CharUtil.CharStream) => Outcome<T>;
    /**
     * right returns a parser that applies the parser p,
     * then the parser q, and if both are successful,
     * returns the result of q.
     * @param p a parser
     */
    function right<T, U>(p: IParser<T>): (q: IParser<U>) => (istream: CharUtil.CharStream) => Outcome<U>;
    /**
     * between returns a parser that applies the parser
     * popen, p, and pclose in sequence, and if all are
     * successful, returns the result of p.
     * @param popen the first parser
     */
    function between<T, U, V>(popen: IParser<T>): (pclose: IParser<U>) => (p: IParser<V>) => IParser<V>;
    /**
     * The debug parser takes a parser p and a debug string,
     * printing the debug string as a side-effect before
     * applying p to the input.
     * @param p a parser
     */
    function debug<T>(p: IParser<T>): (label: string) => (istream: CharUtil.CharStream) => Outcome<T>;
    /**
     * ws matches zero or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws returns matched whitespace in a single CharStream result.
     */
    function ws(): IParser<CharUtil.CharStream>;
    /**
     * ws1 matches one or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws1 returns matched whitespace in a single CharStream result.
     */
    function ws1(): IParser<CharUtil.CharStream>;
}
