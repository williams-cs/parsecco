import { CharUtil } from "./charstream";
import CharStream = CharUtil.CharStream;
import { ErrorType } from "./Errors/ErrorType";
export declare namespace Primitives {
    class EOFMark {
        private static _instance;
        private constructor();
        static readonly Instance: EOFMark;
    }
    const EOF: EOFMark;
    /**
     * Represents an Errors composition function.
     */
    interface EComposer {
        (e: ErrorType): ErrorType;
    }
    /**
     * Represents a successful parse.
     */
    class Success<T> {
        tag: "success";
        inputstream: CharStream;
        result: T;
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream: CharStream, res: T);
    }
    /**
     * Represents a failed parse.
     */
    class Failure {
        tag: "failure";
        inputstream: CharStream;
        error_pos: number;
        error: ErrorType;
        /**
         * Returns an object representing a failed parse.
         *
         * @param istream The string, unmodified, that was given to the parser.
         * @param error_pos The position of the parsing failure in istream
         * @param error The error message for the failure
         */
        constructor(istream: CharStream, error_pos: number, error: ErrorType);
    }
    /**
     * Union type representing a successful or failed parse.
     */
    type Outcome<T> = Success<T> | Failure;
    /**
     * Generic type of a parser.
     */
    interface IParser<T> {
        (inputstream: CharStream): Outcome<T>;
    }
    /**
     * result succeeds without consuming any input, and returns v.
     * @param v The result of the parse.
     */
    function result<T>(v: T): IParser<T>;
    /**
     * zero fails without consuming any input.
     * @param expecting the error message.
     */
    function zero<T>(expecting: string): IParser<T>;
    /**
     * expect tries to apply the given parser and returns the result of that parser
     * if it succeeds, otherwise it replaces the current stream with a stream with
     * modified code given a correct edit, and tries again.
     *
     * @param parser The parser to try
     * @param f A function that produces a new Errors given an existing Errors
     */
    function expect<T>(parser: IParser<T>): (f: EComposer) => IParser<T>;
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
    function delay<T>(p: IParser<T>): () => IParser<T>;
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
     */
    function sat(char_class: string[]): IParser<CharStream>;
    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * @param c
     */
    function char(c: string): IParser<CharStream>;
    function lower_chars(): string[];
    function upper_chars(): string[];
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case.
     */
    function letter(): IParser<CharStream>;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    function digit(): IParser<CharStream>;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper(): IParser<CharStream>;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower(): IParser<CharStream>;
    /**
     * choice specifies an ordered choice between two parsers,
     * p1 and p2. The returned parser will first apply
     * parser p1.  If p1 succeeds, p1's Outcome is returned.
     * If p1 fails, p2 is applied and the Outcome of p2 is returned.
     *
     * An exception is when an outcome is a critical failure,
     * that outcome is immediately returned.
     *
     * @param p1 A parser.
     */
    function choice<T>(p1: IParser<T>): (p2: IParser<T>) => IParser<T>;
    /**
     * Like choice, but chooses from multiple possible parsers
     * The parser will be tried in the order of the input, and the result of
     * the first parser to succeed is returned
     * Example usage: choices(p1, p2, p3)
     *
     * @param parsers An array of parsers to try
     */
    function choices<T>(...parsers: IParser<T>[]): IParser<T>;
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    function appfun<T, U>(p: IParser<T>): (f: (t: T) => U) => (istream: CharUtil.CharStream) => Failure | Success<U>;
    /**
     * many repeatedly applies the parser p until p fails. many always
     * succeeds, even if it matches nothing or if an outcome is critical.
     * many tries to guard against an infinite loop by raising an exception
     * if p succeeds without changing the parser state.
     * @param p The parser to try
     */
    function many<T>(p: IParser<T>): IParser<T[]>;
    /**
     * many1 repeatedly applies the parser p until p fails. many1 must
     * succeed at least once.  many1 tries to guard against an infinite
     * loop by raising an exception if p succeeds without changing the
     * parser state.
     * @param p The parser to try
     */
    function many1<T>(p: IParser<T>): (istream: CharUtil.CharStream) => Outcome<T[]>;
    /**
     * str yields a parser for the given string.
     * @param s A string
     */
    function str(s: string): IParser<CharStream>;
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
     * Note: ws NEVER fails
     */
    function ws(): IParser<CharStream>;
    /**
     * ws1 matches one or more of the following whitespace characters:
     * ' ', '\t', '\n', or '\r\n'
     * ws1 returns matched whitespace in a single CharStream result.
     */
    function ws1(): IParser<CharStream>;
    /**
     * nl matches and returns a newline.
     */
    function nl(): IParser<CharStream>;
    function strSat(strs: string[]): IParser<CharStream>;
}
