/**
 * Represents a successful parse.
 */
export class Success<T> {
    tag: "success" = "success";
    result: T;
    inputstream: string;
    /**
     * Returns an object representing a successful parse.
     * @param istream The remaining string.
     * @param res The result of the parse
     */
    constructor(istream: string, res: T) {
        this.inputstream = istream;
        this.result = res;
    }
}

/**
 * Represents a failed parse.
 */
export class Failure {
    tag: "failure" = "failure";
    inputstream: string;
    /**
     * Returns an object representing a failed parse.
     * @param istream The string, unmodified, that was given to the parser.
     */
    constructor(istream: string) {
        this.inputstream = istream;
    }
}

/**
 * Union type representing a successful or failed parse.
 */
export type Outcome<T> = Success<T> | Failure;

/**
 * Generic type of a parser.
 */
export interface IParser<T> {
    (inputstream: string) : Outcome<T>
}

/**
 * result succeeds without consuming any input, and returns v.
 * @param v The result of the parse.
 */
export function result<T>(v: T) : IParser<T> {
    return (istream) => new Success<T>(istream, v);
}

/**
 * zero fails without consuming any input.
 */
export function zero<T>() : IParser<T> {
    return (istream) => new Failure(istream);
}

/**
 * item successfully consumes the first character if the input
 * string is non-empty, otherwise it fails.
 */
export function item() {
    return (istream: string) => {
        if (istream.length == 0) {
            return new Failure(istream);
        } else {
            return new Success(istream.slice(1,istream.length), istream.charAt(0));
        }
    }
}

/**
 * bind is a curried function that takes a parser p and returns
 * a function that takes a parser f which returns the composition
 * of p and f.
 * @param p A parser
 */
export function bind<T,U>(p: IParser<T>) {
    return (f: (t: T) => IParser<U>) => {
        return (istream: string) => {
            let r = p(istream)
            switch (r.tag) {
                case "success": return f(r.result)(r.inputstream);
                case "failure": return r;
            }
        }
    }
}

/**
 * seq is a curried function that takes a parser p, a parser q,
 * and a function f. It applies p to the input, passing the
 * remaining input stream to q; q is then applied.  The function
 * f takes the result of p and q, as a tuple, and returns
 * a single result.
 * @param p A parser
 */
export function seq<T,U,V>(p: IParser<T>) {
    return (q: IParser<U>) => {
        return (f: (e: [T,U]) => V) => {
            return bind<T,V>(p)((x) => {
                return bind<U,V>(q)((y) => {
                    let tup : [T,U] = [x,y];
                    return result<V>(f(tup));
                });
            });
        }
    };
}

/**
 * sat takes a predicate and yields a parser that consumes a
 * single character if the character satisfies the predicate,
 * otherwise it fails.
 * @param pred 
 */
export function sat(pred: (s: string) => boolean) : IParser<string> {
    let a: IParser<string> = item();
    let b = (x: string) => {
        if (pred(x)) {
            return result(x);
        } else {
            return zero<string>();
        }
    };
    return bind<string,string>(a)(b);
}