"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const charstream_1 = require("../lib/charstream");
// import {CharUtil} from '../lib/index';
const index_1 = require("../lib/index");
const chai_1 = require("chai");
require("mocha");
const inputstream = new charstream_1.CharUtil.CharStream("helloworld");
describe('Failure object', () => {
    it('should consume none of the input stream', () => {
        const output = new index_1.Primitives.Failure(inputstream);
        chai_1.expect(output.inputstream).to.equal(inputstream);
    });
});
describe('Result parser', () => {
    it('should succeed without consuming any input', () => {
        const output = index_1.Primitives.result(true)(inputstream);
        chai_1.expect(output.inputstream).to.equal(inputstream);
    });
});
describe('Zero parser', () => {
    it('should fail and consume no input', () => {
        const output = index_1.Primitives.zero()(inputstream);
        chai_1.expect(output.inputstream).to.equal(inputstream);
        switch (output.tag) {
            case "failure":
                chai_1.assert(true);
                break;
            default:
                chai_1.assert.fail();
                break;
        }
    });
});
describe('Item parser', () => {
    it('should successfully consume input when there is input to consume', () => {
        const output = index_1.Primitives.item()(inputstream);
        chai_1.expect(output.inputstream.toString()).to.equal("elloworld");
    });
    it('should fail to consume input when there is no input to consume', () => {
        const empty = new charstream_1.CharUtil.CharStream("");
        const output = index_1.Primitives.item()(empty);
        chai_1.expect(output.inputstream.toString()).to.equal("");
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
});
describe('Sat parser', () => {
    it('should successfully consume input that matches a predicate', () => {
        const output = index_1.Primitives.sat((s) => s === "h")(inputstream);
        chai_1.expect(output.inputstream.toString()).to.equal("elloworld");
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
});
describe('Seq parser', () => {
    it('should successfully apply two parsers in a row', () => {
        const output = index_1.Primitives.seq(index_1.Primitives.item())(index_1.Primitives.item())(tup => tup[1].concat(tup[0]))(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("eh");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should not eagerly compose two parsers', () => {
        let p2 = i => index_1.Primitives.seq(index_1.Primitives.char("."))(p2)(x => x[0])(i);
        let p = p2;
        chai_1.assert(true);
    });
});
describe('Char parser', () => {
    it('should successfully consume the given character if it is next in the stream', () => {
        const output = index_1.Primitives.char("h")(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail if the given character is not the next in the stream', () => {
        const output = index_1.Primitives.char("e")(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
});
describe('Letter parser', () => {
    it('should successfully consume an alphabetic letter', () => {
        const output = index_1.Primitives.letter()(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail to consume a non-alphabetic letter', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("!helloworld");
        const output = index_1.Primitives.letter()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
        ;
    });
    it('should only consume a single alphabetic letter', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("hey");
        const output = index_1.Primitives.letter()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
});
describe('Digit parser', () => {
    it('should successfully consume a numeric digit if the next character in the stream is a numeric character', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("0helloworld");
        const output = index_1.Primitives.digit()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("0");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail if the next character in the stream is not a numeric character', () => {
        const output = index_1.Primitives.digit()(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
        ;
    });
});
describe('Upper parser', () => {
    it('should successfully consume an uppercase character if the next char in the stream is uppercase', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("Helloworld");
        const output = index_1.Primitives.upper()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("H");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if the next character in the stream is not uppercase', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("hElloworld");
        const output = index_1.Primitives.upper()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
        ;
    });
    it('should fail if the next character in the stream is not a letter', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("#helloworld");
        const output = index_1.Primitives.upper()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
        ;
    });
});
describe('Lower parser', () => {
    it('should successfully consume a lower character if the next char in the stream is lowercase', () => {
        const output = index_1.Primitives.lower()(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if the next character in the stream is not lowercase', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("#helloworld");
        const output = index_1.Primitives.lower()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
        ;
    });
    it('should fail if the next character in the stream is not a letter', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("#helloworld");
        const output = index_1.Primitives.lower()(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
        ;
    });
});
describe('Choice parser', () => {
    it('should allow parsing alternatives', () => {
        const output = index_1.Primitives.choice(index_1.Primitives.upper())(index_1.Primitives.lower())(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if no alternatives can be applied', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("4helloworld");
        const output = index_1.Primitives.choice(index_1.Primitives.upper())(index_1.Primitives.lower())(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
});
describe('Appfun parser', () => {
    it('should apply a function to the result of a successful parse', () => {
        const output = index_1.Primitives.appfun(index_1.Primitives.item())(s => "whatever!")(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result).to.equal("whatever!");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if p fails', () => {
        const empty = new charstream_1.CharUtil.CharStream("");
        const output = index_1.Primitives.appfun(index_1.Primitives.item())(s => "whatever!")(empty);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
});
describe('Many parser', () => {
    it('should apply the given parser until the end of the input', () => {
        const output = index_1.Primitives.many(index_1.Primitives.item())(inputstream);
        chai_1.expect(output.result.toString()).to.equal("h,e,l,l,o,w,o,r,l,d");
    });
    it('including zero times', () => {
        const empty = new charstream_1.CharUtil.CharStream("");
        const output = index_1.Primitives.many(index_1.Primitives.item())(empty);
        chai_1.expect(output.result).to.eql([]);
    });
    it('should apply the given parser until it fails', () => {
        const tstring = "54hello";
        const inputstream2 = new charstream_1.CharUtil.CharStream(tstring);
        const output = index_1.Primitives.many(index_1.Primitives.digit())(inputstream2);
        switch (output.tag) {
            case "success":
                let s = "";
                for (let digit of output.result) {
                    s += digit.toString();
                }
                chai_1.expect(s).to.equal("54");
                break;
        }
    });
});
describe('Str parser', () => {
    it('should match a string and leave remainder in inputstream', () => {
        const output = index_1.Primitives.str("hello")(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("hello");
                chai_1.expect(output.inputstream.toString()).to.equal("world");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if string is not in input stream', () => {
        const inputstream2 = new charstream_1.CharUtil.CharStream("worldhello");
        const output = index_1.Primitives.str("hello")(inputstream2);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
});
describe('EOF parser', () => {
    it('should succeed at the end of the input', () => {
        const p = index_1.Primitives.seq(index_1.Primitives.str("helloworld"))(index_1.Primitives.eof())(tup => tup[0]);
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("helloworld");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail when not at the end of the input', () => {
        const p = index_1.Primitives.seq(index_1.Primitives.str("hello"))(index_1.Primitives.eof())(tup => tup[0]);
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
    });
});
describe('FResult parser', () => {
    it('should return the given value if the given parser succeeds', () => {
        const p = index_1.Primitives.fresult(index_1.Primitives.str("hello"))(1);
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result).to.equal(1);
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail if the parser fails', () => {
        const p = index_1.Primitives.fresult(index_1.Primitives.str("ello"))(1);
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
});
describe('Left parser', () => {
    it('should apply p and q in sequence and return the result of q on success', () => {
        const p = index_1.Primitives.left(index_1.Primitives.str("hello"))(index_1.Primitives.str("world"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("hello");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail if p fails', () => {
        const p = index_1.Primitives.left(index_1.Primitives.str("z"))(index_1.Primitives.str("world"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
    it('should fail if q fails', () => {
        const p = index_1.Primitives.left(index_1.Primitives.str("hello"))(index_1.Primitives.str("z"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
});
describe('Right parser', () => {
    it('should apply p and q in sequence and return the result of q on success', () => {
        const p = index_1.Primitives.right(index_1.Primitives.str("hello"))(index_1.Primitives.str("world"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("world");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail if p fails', () => {
        const p = index_1.Primitives.right(index_1.Primitives.str("z"))(index_1.Primitives.str("world"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
    it('should fail if q fails', () => {
        const p = index_1.Primitives.right(index_1.Primitives.str("hello"))(index_1.Primitives.str("z"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
});
describe('Between parser', () => {
    const input = new charstream_1.CharUtil.CharStream("foo(bar)");
    it('should apply popen, p, and pclose in sequence and return the result of p on success', () => {
        const p = index_1.Primitives.between(index_1.Primitives.str("foo("))(index_1.Primitives.char(")"))(index_1.Primitives.str("bar"));
        const output = p(input);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("bar");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
        ;
    });
    it('should fail if popen fails', () => {
        const p = index_1.Primitives.between(index_1.Primitives.str("zoo("))(index_1.Primitives.str("bar"))(index_1.Primitives.char(")"));
        const output = p(input);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(input);
                break;
        }
        ;
    });
    it('should fail if pclose fails', () => {
        const p = index_1.Primitives.between(index_1.Primitives.str("foo("))(index_1.Primitives.str("bar"))(index_1.Primitives.char("-"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
    it('should fail if p fails', () => {
        const p = index_1.Primitives.between(index_1.Primitives.str("foo("))(index_1.Primitives.str("huh"))(index_1.Primitives.char(")"));
        const output = p(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
        ;
    });
});
describe('many1 parser', () => {
    it('should succeed if p succeeds at least once', () => {
        const i = new charstream_1.CharUtil.CharStream("hhhelloworld");
        const p = index_1.Primitives.many1(index_1.Primitives.char('h'));
        const output = p(i);
        switch (output.tag) {
            case "success":
                chai_1.expect(charstream_1.CharUtil.CharStream.concat(output.result).toString()).to.equal("hhh");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if p does not succeed at least once', () => {
        const i = new charstream_1.CharUtil.CharStream("elloworld");
        const p = index_1.Primitives.many1(index_1.Primitives.char('h'));
        const output = p(i);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(i);
                break;
        }
    });
});
describe('ws parser', () => {
    it('should successfully consume whitespace', () => {
        const i = new charstream_1.CharUtil.CharStream(" \t  \n\t \r\nhelloworld");
        const output = index_1.Primitives.ws()(i);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal(" \t  \n\t \r\n");
                chai_1.expect(output.inputstream.toString()).to.equal("helloworld");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should succeed even if the string has no whitespace', () => {
        const output = index_1.Primitives.ws()(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("");
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
});
describe('ws1 parser', () => {
    it('should successfully consume whitespace', () => {
        const i = new charstream_1.CharUtil.CharStream(" \t  \n\t \r\nhelloworld");
        const output = index_1.Primitives.ws1()(i);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal(" \t  \n\t \r\n");
                chai_1.expect(output.inputstream.toString()).to.equal("helloworld");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if the string has no whitespace', () => {
        const output = index_1.Primitives.ws1()(inputstream);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.equal(inputstream);
                break;
        }
    });
});
describe('nl parser', () => {
    it('should successfully match a UNIX newline', () => {
        const i = new charstream_1.CharUtil.CharStream("\n");
        const output = index_1.Primitives.nl()(i);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("\n");
                chai_1.expect(output.inputstream.toString()).to.equal("");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should successfully match a Windows newline', () => {
        const i = new charstream_1.CharUtil.CharStream("\r\n");
        const output = index_1.Primitives.nl()(i);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("\r\n");
                chai_1.expect(output.inputstream.toString()).to.equal("");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should not match other whitespace', () => {
        const i = new charstream_1.CharUtil.CharStream(" ");
        const output = index_1.Primitives.nl()(i);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
    it('should not match the empty string', () => {
        const i = new charstream_1.CharUtil.CharStream("");
        const output = index_1.Primitives.nl()(i);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.assert(true);
                break;
        }
    });
});
describe('strSat parser', () => {
    it('should match the shortest, lexicographically first string in the given set that occurs in the input', () => {
        const i = new charstream_1.CharUtil.CharStream("the quick brown fox jumps over the lazy dog");
        const strs = ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog"];
        const output = index_1.Primitives.strSat(strs)(i);
        switch (output.tag) {
            case "success":
                chai_1.expect(output.result.toString()).to.equal("the");
                chai_1.expect(output.inputstream.toString()).to.equal(" quick brown fox jumps over the lazy dog");
                break;
            case "failure":
                chai_1.assert.fail();
                break;
        }
    });
    it('should fail if there are no matches', () => {
        const i = new charstream_1.CharUtil.CharStream("hello world");
        const strs = ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog"];
        const output = index_1.Primitives.strSat(strs)(i);
        switch (output.tag) {
            case "success":
                chai_1.assert.fail();
                break;
            case "failure":
                chai_1.expect(output.inputstream).to.eql(i);
                break;
        }
    });
});
//# sourceMappingURL=primitive.spec.js.map