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
     * @param expecting the error message.
     */
    function zero<T>(expecting: string): IParser<T>;
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
     * @param pred a character predicate
     */
    function sat(char_class: string[]): IParser<CharUtil.CharStream>;
    function lower_chars(): string[];
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
}
