import {Primitives, CharUtil} from '../lib/index';
import { assert,expect } from 'chai';
import 'mocha';

const inputstream = new CharUtil.CharStream("helloworld");

describe('Failure object', () => {
  it('should consume none of the input stream', () => {
    const output = new Primitives.Failure(inputstream);
    expect(output.inputstream).to.equal(inputstream);
  });
});

describe('Result parser', () => {
    it('should succeed without consuming any input', () => {
        const output = Primitives.result(true)(inputstream);
        expect(output.inputstream).to.equal(inputstream);
    });
});

describe('Zero parser', () => {
    it('should fail and consume no input', () => {
        const output = Primitives.zero<string>()(inputstream);
        expect(output.inputstream).to.equal(inputstream);
        switch(output.tag) {
            case "failure":
                assert(true);
                break;
            default:
                assert.fail();
                break;
        }
    });
});

describe('Item parser', () => {
    it('should successfully consume input when there is input to consume', () => {
        const output = Primitives.item()(inputstream);
        expect(output.inputstream.toString()).to.equal("elloworld");
    });

    it('should fail to consume input when there is no input to consume', () => {
        const empty = new CharUtil.CharStream("");
        const output = Primitives.item()(empty);
        expect(output.inputstream.toString()).to.equal("");
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        }
    });
});

describe('Sat parser', () => {
    it('should successfully consume input that matches a predicate', () => {
        const output = Primitives.sat((s) => s === "h")(inputstream);
        expect(output.inputstream.toString()).to.equal("elloworld");
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });
});

describe('Seq parser', () => {
    it('should successfully apply two parsers in a row', () => {
        const output = Primitives.seq<CharUtil.CharStream,CharUtil.CharStream,CharUtil.CharStream>(Primitives.item())(Primitives.item())(tup => tup[1].concat(tup[0]))(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("eh");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });
});

describe('Char parser', () => {
    it('should successfully consume the given character if it is next in the stream', () => {
        const output = Primitives.char("h")(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        };
    });

    it('should fail if the given character is not the next in the stream', () => {
        const output = Primitives.char("e")(inputstream);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        }
    });
});

describe('Letter parser', () => {
    it('should successfully consume an alphabetic letter', () => {
        const output = Primitives.letter()(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        };
    });

    it('should fail to consume a non-alphabetic letter', () => {
        const inputstream2 = new CharUtil.CharStream("!helloworld");
        const output = Primitives.letter()(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        };
    });
});

describe('Digit parser', () => {
    it('should successfully consume a numeric digit if the next character in the stream is a numeric character', () => {
        const inputstream2 = new CharUtil.CharStream("0helloworld");
        const output = Primitives.digit()(inputstream2);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("0");
                break;
            case "failure":
                assert.fail();
                break;
        };
    });

    it('should fail if the next character in the stream is not a numeric character', () => {
        const output = Primitives.digit()(inputstream);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        };
    });
});

describe('Upper parser', () => {
    it('should successfully consume an uppercase character if the next char in the stream is uppercase', () => {
        const inputstream2 = new CharUtil.CharStream("Helloworld");
        const output = Primitives.upper()(inputstream2);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("H");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if the next character in the stream is not uppercase', () => {
        const inputstream2 = new CharUtil.CharStream("hElloworld");
        const output = Primitives.upper()(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        };
    });

    it('should fail if the next character in the stream is not a letter', () => {
        const inputstream2 = new CharUtil.CharStream("#helloworld");
        const output = Primitives.upper()(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        };
    });
});

describe('Lower parser', () => {
    it('should successfully consume a lower character if the next char in the stream is lowercase', () => {
        const output = Primitives.lower()(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if the next character in the stream is not lowercase', () => {
        const inputstream2 = new CharUtil.CharStream("#helloworld");
        const output = Primitives.lower()(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        };
    });

    it('should fail if the next character in the stream is not a letter', () => {
        const inputstream2 = new CharUtil.CharStream("#helloworld");
        const output = Primitives.lower()(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        };
    });
});

describe('Choice parser', () => {
    it('should allow parsing alternatives', () => {
        const output = Primitives.choice(Primitives.upper())(Primitives.lower())(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if no alternatives can be applied', () => {
        const inputstream2 = new CharUtil.CharStream("4helloworld");
        const output = Primitives.choice(Primitives.upper())(Primitives.lower())(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        }
    });
});

describe('Appfun parser', () => {
    it('should apply a function to the result of a successful parse', () => {
        const output = Primitives.appfun(Primitives.item())(s => "whatever!")(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("whatever!");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if p fails', () => {
        const empty = new CharUtil.CharStream("");
        const output = Primitives.appfun(Primitives.item())(s => "whatever!")(empty);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        }
    });
});

describe('Many parser', () => {
    it('should apply the given parser as many times as it can', () => {
        const output = Primitives.many(Primitives.item())(inputstream);
        expect(output.result.toString()).to.equal("h,e,l,l,o,w,o,r,l,d");
    });

    it('including zero times', () => {
        const empty = new CharUtil.CharStream("");
        const output = Primitives.many(Primitives.item())(empty);
        expect(output.result).to.eql([]);
    });
});

describe('Word parser', () => {
    it('should match a string and leave remainder in inputstream', () => {
        const output = Primitives.word("hello")(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result.toString()).to.equal("hello");
                expect(output.inputstream.toString()).to.equal("world");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if string is not in input stream', () => {
        const inputstream2 = new CharUtil.CharStream("worldhello");
        const output = Primitives.word("hello")(inputstream2);
        switch(output.tag) {
            case "success":
                assert.fail();
                break;
            case "failure":
                assert(true);
                break;
        }
    })
});