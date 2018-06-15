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

/**
 * char takes a character and yields a parser that consume
 * that character. The returned parser succeeds if the next
 * character in the input stream is c, otherwise it fails.
 * @param c 
 */
export function char(c: string) : IParser<string> {
    if (c.length != 1) {
        throw new Error("char parser takes a string of length 1 (i.e., a char)");
    }
    return sat(x => x == c);
}

/**
 * letter returns a parser that consumes a single alphabetic
 * character, from a-z, regardless of case.
 */
export function letter() : IParser<string> {
    let contains_letter = (x: string) => {
        let a_letter = /[A-Za-z]/;
        return x.match(a_letter) != undefined;
    }
    return sat(contains_letter);
}

/**
 * digit returns a parser that consumes a single numeric
 * character, from 0-9.  Note that the type of the result
 * is a string, not a number.
 */
export function digit() : IParser<string> {
    return sat(x => x == "0"
                 || x == "1"
                 || x == "2"
                 || x == "3"
                 || x == "4"
                 || x == "5"
                 || x == "6"
                 || x == "7"
                 || x == "8"
                 || x == "9");
}

/**
 * upper returns a parser that consumes a single character
 * if that character is uppercase.
 */
export function upper() : IParser<string> {
    return (istream: string) => {
        let o1 = letter()(istream);
        switch(o1.tag) {
            case "success":
                let o2 = sat(x => x == x.toUpperCase())(o1.result);
                switch(o2.tag) {
                    case "success":
                        return o1;
                        break;
                    case "failure":
                        // TODO: this is not correct
                        return o1;
                }
                break;
            case "failure":
                return o1;
                break;
        }
        
        
        throw new Error();
    }
}

/**
 * lower returns a parser that consumes a single character
 * if that character is lowercase.
 */
export function lower() : IParser<string> {
    return sat(x => x == x.toLowerCase());
}

/**
 * choice specifies an ordered choice between two parsers,
 * p1 and p2. The returned parser will first apply
 * parser p1.  If p1 succeeds, p1's Outcome is returned.
 * If p2 fails, p2 is applied and the Outcome of p2 is returned.
 * Note that the input stream given to p1 and p2 is exactly
 * the same input stream.
 * @param p1 A parser.
 */
export function choice<T>(p1: IParser<T>) {
    return (p2: IParser<T>) => {
        return (istream: string) => {
            let o = p1(istream)
            switch(o.tag) {
                case "success":
                    return o;
                case "failure":
                    return p2(istream);
            }
        };
    };
}