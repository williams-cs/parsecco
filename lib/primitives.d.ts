export declare namespace Primitives {
    /**
     * Represents a successful parse.
     */
    class Success<T> {
        tag: "success";
        result: T;
        inputstream: string;
        /**
         * Returns an object representing a successful parse.
         * @param istream The remaining string.
         * @param res The result of the parse
         */
        constructor(istream: string, res: T);
    }
    /**
     * Represents a failed parse.
     */
    class Failure {
        tag: "failure";
        inputstream: string;
        /**
         * Returns an object representing a failed parse.
         * @param istream The string, unmodified, that was given to the parser.
         */
        constructor(istream: string);
    }
    /**
     * Union type representing a successful or failed parse.
     */
    type Outcome<T> = Success<T> | Failure;
    /**
     * Generic type of a parser.
     */
    interface IParser<T> {
        (inputstream: string): Outcome<T>;
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
    function item(): (istream: string) => Outcome<string>;
    /**
     * bind is a curried function that takes a parser p and returns
     * a function that takes a parser f which returns the composition
     * of p and f.
     * @param p A parser
     */
    function bind<T, U>(p: IParser<T>): (f: (t: T) => IParser<U>) => (istream: string) => Outcome<U>;
    /**
     * seq is a curried function that takes a parser p, a parser q,
     * and a function f. It applies p to the input, passing the
     * remaining input stream to q; q is then applied.  The function
     * f takes the result of p and q, as a tuple, and returns
     * a single result.
     * @param p A parser
     */
    function seq<T, U, V>(p: IParser<T>): (q: IParser<U>) => (f: (e: [T, U]) => V) => (istream: string) => Outcome<V>;
    /**
     * sat takes a predicate and yields a parser that consumes a
     * single character if the character satisfies the predicate,
     * otherwise it fails.
     * @param pred
     */
    function sat(pred: (s: string) => boolean): IParser<string>;
    /**
     * char takes a character and yields a parser that consume
     * that character. The returned parser succeeds if the next
     * character in the input stream is c, otherwise it fails.
     * @param c
     */
    function char(c: string): IParser<string>;
    /**
     * letter returns a parser that consumes a single alphabetic
     * character, from a-z, regardless of case.
     */
    function letter(): IParser<string>;
    /**
     * digit returns a parser that consumes a single numeric
     * character, from 0-9.  Note that the type of the result
     * is a string, not a number.
     */
    function digit(): IParser<string>;
    /**
     * upper returns a parser that consumes a single character
     * if that character is uppercase.
     */
    function upper(): IParser<string>;
    /**
     * lower returns a parser that consumes a single character
     * if that character is lowercase.
     */
    function lower(): IParser<string>;
    /**
     * choice specifies an ordered choice between two parsers,
     * p1 and p2. The returned parser will first apply
     * parser p1.  If p1 succeeds, p1's Outcome is returned.
     * If p2 fails, p2 is applied and the Outcome of p2 is returned.
     * Note that the input stream given to p1 and p2 is exactly
     * the same input stream.
     * @param p1 A parser.
     */
    function choice<T>(p1: IParser<T>): (p2: IParser<T>) => (istream: string) => Outcome<T>;
    /**
     * appfun allows the user to apply a function f to
     * the result of a parser p, assuming that p is successful.
     * @param p A parser.  This is the same as the |>>
     * function from FParsec.
     */
    function appfun<T, U>(p: IParser<T>): (f: (t: T) => U) => (istream: string) => Failure | Success<U>;
    /**
     * many repeatedly applies the parser p until p fails. many tries
     * to guard against an infinite loop by raising an exception if p
     * succeeds without changing the parser state.
     * @param p
     */
    function many<T>(p: IParser<T>): (istream: string) => Success<T[]>;
    /**
     * word yields a parser for the given string.
     * @param s A string
     */
    function word(s: string): (istream: string) => Outcome<string>;
}
