/**
 * Represents a successful parse.
 */
export class Success<T> {
    tag: "success";
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
    tag: "failure";
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
 * @param p 
 */
export function bind<T,U>(p: IParser<T>) {
    return (f: IParser<U>) => {
        return (istream: string) => {
            let r = p(istream)
            switch (r.tag) {
                case "success": return f(r.inputstream);
                case "failure": return r;
            }
        }
    }
}

/**
 * sat takes a predicate and yields a parser that consumes a
 * single character if the character satisfies the predicate,
 * otherwise it fails.
 * @param pred 
 */
export function sat(pred: (string) => boolean) : IParser<string> {
    function checker(pred: (string) => boolean) : IParser<string> {
        return 
            (istream: string) => {
                console.log("DEBUG: istream = " + istream);
                if (pred(istream)) {
                    result(istream);
                } else {
                    return zero();
                }
            }
    }
    console.log("DEBUG: about to bind two parsers");
    console.log("DEBUG: pred is: " + pred);
    return bind<string,string>(item())(checker(pred))
}