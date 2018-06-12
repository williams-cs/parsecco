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
     * @param res The result (usually an AST node)
     */
    constructor(istream: string, res: T) {
        this.inputstream = istream;
        this.result = res;
    }
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
    constructor(istream: string) {
        this.inputstream = istream;
    }
}

/**
 * Union type representing a successful or failed parse.
 */
type Outcome<T> = Success<T> | Failure;

/**
 * Generic type of a parser.
 */
interface IParser<T> {
    (inputstream: string) : Outcome<T>
}

/**
 * result succeeds without consuming any input, and returns v.
 * @param v A value (usually an AST node).
 */
function result<T>(v: T) : IParser<T> {
    return (istream) => new Success<T>(istream, v);
}

/**
 * zero fails without consuming any input.
 */
function zero<T>() : IParser<T> {
    return (istream) => new Failure(istream);
}

/**
 * item successfully consumes the first character if the input
 * string is non-empty, otherwise it fails.
 */
function item() {
    return (istream: string) => {
        if (istream.length == 0) {
            return new Failure(istream);
        } else {
            return new Success(istream.charAt(0), istream.slice(1,istream.length));
        }
    }
}

/**
 * bind is a curried function that takes a parser p and returns
 * a function that takes a parser f which returns the composition
 * of p and f.
 * @param p 
 */
function bind<T,U>(p: IParser<T>) {
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

// TODO: this does not work
let sat = function(pred: (string) => boolean) {
    return bind(item())((istream: string) => {
        if (pred(istream)) {
            result(istream)
        } else {
            zero()
        }
    })
}

function helloworld() {
    return "hello world!";
}