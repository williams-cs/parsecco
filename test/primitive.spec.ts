import * as pants from '../lib/main';
import { assert,expect } from 'chai';
import 'mocha';

describe('Failure object', () => {
  it('should consume none of the input stream', () => {
    const inputstream = "helloworld";
    const output = new pants.Failure(inputstream);
    expect(output.inputstream).to.equal(inputstream);
  });
});

describe('Result parser', () => {
    it('should succeed without consuming any input', () => {
        const inputstream = "helloworld";
        const output = pants.result(true)(inputstream);
        expect(output.inputstream).to.equal(inputstream);
    });
});

describe('Zero parser', () => {
    it('should fail and consume no input', () => {
        const inputstream = "helloworld";
        const output = pants.zero<string>()(inputstream);
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
        const inputstream = "helloworld";
        const output = pants.item()(inputstream);
        expect(output.inputstream).to.equal("elloworld");
    });

    it('should fail to consume input when there is no input to consume', () => {
        const inputstream = "";
        const output = pants.item()(inputstream);
        expect(output.inputstream).to.equal("");
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
        const inputstream = "helloworld";
        const output = pants.sat((s) => s === "h")(inputstream);
        expect(output.inputstream).to.equal("elloworld");
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });
});

describe('Seq parser', () => {
    it('should successfully apply two parsers in a row', () => {
        const inputstream = "helloworld";
        const output = pants.seq(pants.item())(pants.item())((tup) => tup[1] + tup[0])(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("eh");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });
});

describe('Char parser', () => {
    it('should successfully consume the given character if it is next in the stream', () => {
        const inputstream = "helloworld";
        const output = pants.char("h")(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        };
    });

    it('should fail if the given character is not the next in the stream', () => {
        const inputstream = "helloworld";
        const output = pants.char("e")(inputstream);
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
        const inputstream = "helloworld";
        const output = pants.letter()(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        };
    });

    it('should fail to consume a non-alphabetic letter', () => {
        const inputstream = "!helloworld";
        const output = pants.letter()(inputstream);
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
        const inputstream = "0helloworld";
        const output = pants.digit()(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("0");
                break;
            case "failure":
                assert.fail();
                break;
        };
    });

    it('should fail if the next character in the stream is not a numeric character', () => {
        const inputstream = "helloworld";
        const output = pants.digit()(inputstream);
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
        const inputstream = "Helloworld";
        const output = pants.upper()(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("H");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if the next character in the stream is not uppercase', () => {
        const inputstream = "hElloworld";
        const output = pants.upper()(inputstream);
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
        const inputstream = "#helloworld";
        const output = pants.upper()(inputstream);
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
        const inputstream = "helloworld";
        const output = pants.lower()(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if the next character in the stream is not lowercase', () => {
        const inputstream = "Helloworld";
        const output = pants.lower()(inputstream);
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
        const inputstream = "#helloworld";
        const output = pants.lower()(inputstream);
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
        const inputstream = "helloworld";
        const output = pants.choice(pants.upper())(pants.lower())(inputstream);
        switch(output.tag) {
            case "success":
                expect(output.result).to.equal("h");
                break;
            case "failure":
                assert.fail();
                break;
        }
    });

    it('should fail if no alternatives can be applied', () => {
        const inputstream = "4helloworld";
        const output = pants.choice(pants.upper())(pants.lower())(inputstream);
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
        const inputstream = "helloworld";
        const output = pants.appfun(pants.item())(s => "whatever!")(inputstream);
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
        const inputstream = "";
        const output = pants.appfun(pants.item())(s => "whatever!")(inputstream);
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