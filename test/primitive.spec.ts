import { CharUtil as CU } from "../src/charstream";
import { Primitives as P } from "../src/primitives";
import { assert, expect } from "chai";
import "mocha";

const inputstream = new CU.CharStream("helloworld");

describe("Failure object", () => {
  it("should consume none of the input stream", () => {
    const output = new P.Failure(inputstream, inputstream.startpos);
    expect(output.inputstream).to.equal(inputstream);
  });
});

describe("Result parser", () => {
  it("should succeed without consuming any input", () => {
    const output = P.result(true)(inputstream);
    expect(output.inputstream).to.equal(inputstream);
  });
});

describe("Recparser", () => {
  it("should expand just like an ordinary parser, even for recursive definitions.", () => {
    let res = P.recParser<CU.CharStream>();
    const p: P.IParser<CU.CharStream> = res[0];
    let pImpl = res[1];
    pImpl.contents = P.pipe2<CU.CharStream, CU.CharStream, CU.CharStream>(
      P.item
    )(p)((a, b) => new CU.CharStream(a.toString() + b.toString()));
    // this will eventually bottom out and fail because we've
    // consumed all the tokens, but unlike an actual recursive
    // defintion, it should not loop forever just generating the
    // parsing function.
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        // only an infinite string can succeed!
        assert.fail();
      case "failure":
        assert(true);
    }
  });

  it("should succeed normally, just like any other parser", () => {
    let [expr, impl] = P.recParser<CU.CharStream>();
    impl.contents = P.str("helloworld");
    const output = expr(inputstream);
    switch(output.tag) {
      case "success":
        expect(output.result.toString()).to.equal(inputstream.toString());
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should fail normally, just like any other parser", () => {
    let [expr, impl] = P.recParser<CU.CharStream>();
    impl.contents = P.str("yelloworld");
    const output = expr(inputstream);
    switch(output.tag) {
      case "success":
        assert.fail();
      default:
        expect(output.inputstream).to.equal(inputstream);
    }
  });
});

describe("Zero parser", () => {
  it("should fail and consume no input", () => {
    const output = P.zero("")(inputstream);
    expect(output.inputstream).to.equal(inputstream);
    switch (output.tag) {
      case "failure":
        assert(true);
        break;
      default:
        assert.fail();
    }
  });
});

describe("Fail parser", () => {
  it("should fail if the stream contains the given input, consuming no input", () => {
    const p = P.str("hel");
    const msg = "We never want to see 'hel'!";
    const output = P.fail(p)(msg)(inputstream);
    switch (output.tag) {
      case "failure":
        // stream should not be modified
        expect(output.inputstream).to.eql(inputstream);
        // we should see message
        expect(output.error_msg).to.equal(msg);
        break;
      default:
        assert.fail();
    }
  });

  it("should succeed if the stream does not contain the given input, consuming no input", () => {
    const p = P.str("leh");
    const msg = "We never want to see 'hel'!";
    const output = P.fail(p)(msg)(inputstream);
    switch (output.tag) {
      case "failure":
        assert.fail();
      default:
        // stream should not be modified
        expect(output.inputstream).to.eql(inputstream);
        // output is undefined
        expect(output.result).to.equal(undefined);
    }
  });
});

describe("OK parser", () => {
  it("should succeed and consume no input", () => {
    const result = { an: "arbitrary", obj: 1 };
    const output = P.ok(result)(inputstream);
    expect(output.inputstream).to.equal(inputstream);
    switch (output.tag) {
      case "failure":
        assert(true);
        assert.fail();
      default:
        expect(output.result).to.equal(result);
    }
  });
});

describe("Expect parser", () => {
  it("should create a critical failure with the correct error message and at the correct position", () => {
    let error_msg = "Expected )";
    let inputstream = new CU.CharStream("   (   ");
    let openParen = P.right(P.ws)(P.char("("));
    let closeParen = P.right(P.ws)(P.char(")"));
    let expectCloseParen = P.expect(closeParen)(error_msg);
    let parenParser = P.right(openParen)(expectCloseParen);
    let outcome = parenParser(inputstream);

    switch (outcome.tag) {
      case "failure":
        if (
          !outcome.is_critical ||
          outcome.error_msg != error_msg ||
          outcome.error_pos != 4
        ) {
          assert.fail();
        } else {
          assert(true);
        }
        break;
      default:
        assert.fail();
    }
  });

  it("should not create a failure if the parser succeeds", () => {
    let inputstream = new CU.CharStream("   (  ) ");
    let openParen = P.right(P.ws)(P.char("("));
    let closeParen = P.right(P.ws)(P.char(")"));
    let expectCloseParen = P.expect(closeParen)("Expected )");
    let parenParser = P.right(openParen)(expectCloseParen);
    let outcome = parenParser(inputstream);

    switch (outcome.tag) {
      case "success":
        assert(true);
        break;
      default:
        assert.fail();
    }
  });
});

describe("Item parser", () => {
  it("should successfully consume input when there is input to consume", () => {
    const output = P.item(inputstream);
    expect(output.inputstream.toString()).to.equal("elloworld");
  });

  it("should fail to consume input when there is no input to consume", () => {
    const empty = new CU.CharStream("");
    const output = P.item(empty);
    expect(output.inputstream.toString()).to.equal("");
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("Sat parser", () => {
  it("should successfully consume input that matches a predicate", () => {
    const output = P.sat((ch) => ch === "h")(inputstream);
    expect(output.inputstream.toString()).to.equal("elloworld");
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });
});

describe("SatClass parser", () => {
  it("should successfully consume input that matches a char class", () => {
    const output = P.satClass(["h"])(inputstream);
    expect(output.inputstream.toString()).to.equal("elloworld");
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });
});

describe("Seq parser", () => {
  it("should successfully apply two parsers in a row", () => {
    const output = P.seq<CU.CharStream, CU.CharStream>(P.item)(
      P.item
    )(inputstream);
    const expected = ["h", "e"];
    switch (output.tag) {
      case "success":
        expect(output.result[0].toString()).to.equal(expected[0]);
        expect(output.result[1].toString()).to.equal(expected[1]);
        break;
      case "failure":
        assert.fail();
        break;
    }
  });
});

describe("Char parser", () => {
  it("should successfully consume the given character if it is next in the stream", () => {
    const output = P.char("h")(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if the given character is not the next in the stream", () => {
    const output = P.char("e")(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("Letter parser", () => {
  it("should successfully consume an alphabetic letter", () => {
    const output = P.letter(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail to consume a non-alphabetic letter", () => {
    const inputstream2 = new CU.CharStream("!helloworld");
    const output = P.letter(inputstream2);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });

  it("should only consume a single alphabetic letter", () => {
    const inputstream2 = new CU.CharStream("hey");
    const output = P.letter(inputstream2);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });
});

describe("Digit parser", () => {
  it("should successfully consume a numeric digit if the next character in the stream is a numeric character", () => {
    const inputstream2 = new CU.CharStream("0helloworld");
    const output = P.digit(inputstream2);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("0");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if the next character in the stream is not a numeric character", () => {
    const output = P.digit(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("Integer parser", () => {
  it("should successfully consume a multi-digit number at the start of the input", () => {
    const istr = new CU.CharStream("123helloworld");
    const output = P.integer(istr);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal(123);
        break;
      default:
        assert.fail();
    }
  });

  it("should fail if the input does not begin with a number", () => {
    const istr = new CU.CharStream("h123elloworld");
    const output = P.integer(istr);
    switch (output.tag) {
      case "success":
        assert.fail();
      default:
        assert(true);
    }
  });
});

describe("Floating-point parser", () => {
  it("should successfully consume a multi-digit float at the start of the input", () => {
    const istr = new CU.CharStream("123.3helloworld");
    const output = P.float(istr);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal(123.3);
        break;
      default:
        assert.fail();
    }
  });

  it("should fail if the input does not begin with a number", () => {
    const istr = new CU.CharStream("h123.0elloworld");
    const output = P.float(istr);
    switch (output.tag) {
      case "success":
        assert.fail();
      default:
        assert(true);
    }
  });

  it("should successfully consume a float without a fraction", () => {
    const istr = new CU.CharStream("123");
    const output = P.float(istr);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal(123);
        break;
      default:
        assert.fail();
    }
  });
});

describe("Upper parser", () => {
  it("should successfully consume an uppercase character if the next char in the stream is uppercase", () => {
    const inputstream2 = new CU.CharStream("Helloworld");
    const output = P.upper(inputstream2);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("H");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if the next character in the stream is not uppercase", () => {
    const inputstream2 = new CU.CharStream("hElloworld");
    const output = P.upper(inputstream2);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });

  it("should fail if the next character in the stream is not a letter", () => {
    const inputstream2 = new CU.CharStream("#helloworld");
    const output = P.upper(inputstream2);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("Lower parser", () => {
  it("should successfully consume a lower character if the next char in the stream is lowercase", () => {
    const output = P.lower(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if the next character in the stream is not lowercase", () => {
    const inputstream2 = new CU.CharStream("#helloworld");
    const output = P.lower(inputstream2);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });

  it("should fail if the next character in the stream is not a letter", () => {
    const inputstream2 = new CU.CharStream("#helloworld");
    const output = P.lower(inputstream2);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("Choice parser", () => {
  it("should allow parsing alternatives", () => {
    const outcome = P.choice(P.upper)(P.lower)(inputstream);
    switch (outcome.tag) {
      case "success":
        expect(outcome.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if no alternatives can be applied", () => {
    const inputstream2 = new CU.CharStream("4helloworld");
    const outcome = P.choice(P.upper)(P.lower)(inputstream2);
    switch (outcome.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });

  it("should fail on the first choice if there is a critical failure", () => {
    const p1 = P.expect(P.strSat(["Hello"]))("Expected Hello");
    const p2 = P.strSat(["hello"]);
    const outcome = P.choice(p1)(p2)(inputstream);
    switch (outcome.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(outcome.is_critical).to.equal(true);
        break;
    }
  });
});

describe("Choices parser", () => {
  it("should allow parsing multiple options", () => {
    const p1 = P.char("a");
    const p2 = P.char("b");
    const p3 = P.char("h");
    const p4 = P.char("w");
    const outcome = P.choices(p1, p2, p3, p4)(inputstream);
    switch (outcome.tag) {
      case "success":
        expect(outcome.result.toString()).to.equal("h");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if no alternatives can be applied", () => {
    const p1 = P.char("a");
    const p2 = P.char("b");
    const p3 = P.char("c");
    const p4 = P.char("d");
    const outcome = P.choices(p1, p2, p3, p4)(inputstream);
    switch (outcome.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });

  it("should fail on the first critical failure", () => {
    const p1 = P.char("a");
    const p2 = P.char("b");
    const p3 = P.expect(P.char("c"))("Expected c");
    const p4 = P.char("d");
    const outcome = P.choices(p1, p2, p3, p4)(inputstream);
    switch (outcome.tag) {
      case "success":
        assert.fail();
      case "failure":
        expect(outcome.is_critical).to.equal(true);
        break;
    }
  });
});

describe("Prefix parser", () => {
  it("should allow parsing alternatives that share a prefix (case 1)", () => {
    const outcome = P.prefix(P.str("hello"))(P.str("bacon"))((p,s) => assert.fail())(inputstream);
    switch (outcome.tag) {
      case "success":
        expect(outcome.result.toString()).to.equal("hello");
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should allow parsing alternatives that share a prefix (case 2)", () => {
    const input = new CU.CharStream("hellobacon");
    const outcome = P.prefix<CU.CharStream, CU.CharStream>(P.str("hello"))(P.str("bacon"))((p,s) => new CU.CharStream(p.toString() + s.toString()))(input);
    switch (outcome.tag) {
      case "success":
        expect(outcome.result.toString()).to.equal("hellobacon");
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should only ever run the first parser once (case 1)", () => {
    let i = 0;
    const first = P.pipe<CU.CharStream, CU.CharStream>(P.str("hello"))(r => {i++; return r;});
    const outcome = P.prefix(first)(P.str("bacon"))((p,s) => assert.fail())(inputstream);
    switch (outcome.tag) {
      case "success":
        expect(outcome.result.toString()).to.equal("hello");
        assert(i === 1, "i not equal to 1");
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should only ever run the first parser once (case 2)", () => {
    let i = 0;
    const first = P.pipe<CU.CharStream, CU.CharStream>(P.str("hello"))(r => {i++; return r;});
    const input = new CU.CharStream("hellobacon");
    const outcome = P.prefix<CU.CharStream, CU.CharStream>(first)(P.str("bacon"))((p,s) => new CU.CharStream(p.toString() + s.toString()))(input);
    switch (outcome.tag) {
      case "success":
        expect(outcome.result.toString()).to.equal("hellobacon");
        assert(i === 1, "i not equal to 1");
        break;
      case "failure":
        assert.fail();
    }
  });
});

describe("Appfun parser", () => {
  it("should apply a function to the result of a successful parse", () => {
    const output = P.appfun(P.item)((s) => "whatever!")(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal("whatever!");
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should fail if p fails", () => {
    const empty = new CU.CharStream("");
    const output = P.appfun(P.item)((s) => "whatever!")(empty);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("pipe2 parser", () => {
  it("should not eagerly compose two parsers", () => {
    let p2: P.IParser<CU.CharStream> = (i) =>
      P.pipe2<CU.CharStream, CU.CharStream, CU.CharStream>(P.char("."))(p2)(
        (x,) => x
      )(i);
    assert(true);
  });

  it("should apply a function to the result of two successful parses in sequence", () => {
    const i = new CU.CharStream("ok");
    const f = (a: CU.CharStream, b: CU.CharStream) =>
      a.toString() + b.toString();
    const output = P.pipe2<CU.CharStream, CU.CharStream, string>(P.item)(
      P.item
    )(f)(i);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal("ok");
        break;
      default:
        assert.fail();
    }
  });

  it("should fail if any of the parses fail", () => {
    const i = new CU.CharStream("o");
    const f = (a: CU.CharStream, b: CU.CharStream) =>
      a.toString() + b.toString();
    const output = P.pipe2<CU.CharStream, CU.CharStream, string>(P.item)(
      P.item
    )(f)(i);
    switch (output.tag) {
      case "success":
        assert.fail();
      default:
        assert(true);
    }
  });
});

describe("pipe3 parser", () => {
  it("should apply a function to the result of three successful parses in sequence", () => {
    const i = new CU.CharStream("foo");
    const f = (a: CU.CharStream, b: CU.CharStream, c: CU.CharStream) =>
      a.toString() + b.toString() + c.toString();
    const output = P.pipe3<CU.CharStream, CU.CharStream, CU.CharStream, string>(P.item)(P.item)(P.item)(f)(i);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal("foo");
        break;
      default:
        assert.fail();
    }
  });

  it("should fail if any of the parses fail", () => {
    const i = new CU.CharStream("oo");
    const f = (a: CU.CharStream, b: CU.CharStream, c: CU.CharStream) =>
      a.toString() + b.toString() + c.toString();
    const output = P.pipe3<CU.CharStream, CU.CharStream, CU.CharStream, string>(P.item)(
      P.item
    )(P.item)(f)(i);
    switch (output.tag) {
      case "success":
        assert.fail();
      default:
        assert(true);
    }
  });
});

describe("Many parser", () => {
  it("should apply the given parser until the end of the input", () => {
    const output = P.many(P.item)(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("h,e,l,l,o,w,o,r,l,d");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("including zero times", () => {
    const empty = new CU.CharStream("");
    const output = P.many(P.item)(empty);
    switch (output.tag) {
      case "success":
        expect(output.result).to.eql([]);
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should apply the given parser until it fails", () => {
    const tstring = "54hello";
    const inputstream2 = new CU.CharStream(tstring);
    const output = P.many(P.digit)(inputstream2);
    switch (output.tag) {
      case "success":
        let s = "";
        for (let digit of output.result) {
          s += digit.toString();
        }
        expect(s).to.equal("54");
        break;
    }
  });
});

describe("Str parser", () => {
  it("should match a string and leave remainder in inputstream", () => {
    const p = P.str("hello");
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        // console.log("DEBUGGING!" + inputstream);
        expect(output.result.toString()).to.equal("hello");
        expect(output.inputstream.toString()).to.equal("world");
        break;
      case "failure":
        // console.log("DEBUGGIN! fail")
        assert.fail();
        break;
    }
  });

  it("should fail if string is not in input stream", () => {
    const inputstream2 = new CU.CharStream("worldhello");
    const output = P.str("hello")(inputstream2);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("EOF parser", () => {
  it("should succeed at the end of the input", () => {
    const p = P.pipe2<CU.CharStream, P.EOFMark, CU.CharStream>(
      P.str("helloworld")
    )(P.eof)((a,b) => a);
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("helloworld");
        break;
      case "failure":
        assert.fail();
        // expect(output.high_watermark).to.eq(new P.HighWaterMark(inputstream.startpos, "end of file"))
        break;
    }
  });

  it("should fail when not at the end of the input", () => {
    const p = P.seq(P.str("hello"))(P.eof);
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });
});

describe("FResult parser", () => {
  it("should return the given value if the given parser succeeds", () => {
    const p = P.fresult(P.str("hello"))(1);
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result).to.equal(1);
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if the parser fails", () => {
    const p = P.fresult(P.str("ello"))(1);
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });
});

describe("Left parser", () => {
  it("should apply p and q in sequence and return the result of q on success", () => {
    const p = P.left(P.str("hello"))(P.str("world"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("hello");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if p fails", () => {
    const p = P.left(P.str("z"))(P.str("world"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });

  it("should fail if q fails", () => {
    const p = P.left(P.str("hello"))(P.str("z"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });
});

describe("Right parser", () => {
  it("should apply p and q in sequence and return the result of q on success", () => {
    const p = P.right<CU.CharStream, CU.CharStream>(P.str("hello"))(
      P.str("world")
    );
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("world");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if p fails", () => {
    const p = P.right<CU.CharStream, CU.CharStream>(P.str("z"))(P.str("world"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });

  it("should fail if q fails", () => {
    const p = P.right(P.str("hello"))(P.str("z"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });
});

describe("Between parser", () => {
  const input = new CU.CharStream("foo(bar)");

  it("should apply popen, p, and pclose in sequence and return the result of p on success", () => {
    const p = P.between<CU.CharStream, CU.CharStream, CU.CharStream>(
      P.str("foo(")
    )(P.char(")"))(P.str("bar"));
    const output = p(input);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("bar");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if popen fails", () => {
    const p = P.between(P.str("zoo("))(P.str("bar"))(P.char(")"));
    const output = p(input);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(input);
        break;
    }
  });

  it("should fail if pclose fails", () => {
    const p = P.between(P.str("foo("))(P.str("bar"))(P.char("-"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });

  it("should fail if p fails", () => {
    const p = P.between(P.str("foo("))(P.str("huh"))(P.char(")"));
    const output = p(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });
});

describe("many1 parser", () => {
  it("should succeed if p succeeds at least once", () => {
    const i = new CU.CharStream("hhhelloworld");
    const p = P.many1(P.char("h"));
    const output = p(i);
    switch (output.tag) {
      case "success":
        expect(CU.CharStream.concat(output.result).toString()).to.equal("hhh");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if p does not succeed at least once", () => {
    const i = new CU.CharStream("elloworld");
    const p = P.many1(P.char("h"));
    const output = p(i);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(i);
        break;
    }
  });
});

describe("ws parser", () => {
  it("should successfully consume whitespace", () => {
    const i = new CU.CharStream(" \t  \n\t \r\nhelloworld");
    const output = P.ws(i);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal(" \t  \n\t \r\n");
        expect(output.inputstream.toString()).to.equal("helloworld");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should succeed even if the string has no whitespace", () => {
    const output = P.ws(inputstream);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("");
        expect(output.inputstream).to.equal(inputstream);
        break;
      case "failure":
        assert.fail();
        break;
    }
  });
});

describe("ws1 parser", () => {
  it("should successfully consume whitespace", () => {
    const i = new CU.CharStream(" \t  \n\t \r\nhelloworld");
    const output = P.ws1(i);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal(" \t  \n\t \r\n");
        expect(output.inputstream.toString()).to.equal("helloworld");
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if the string has no whitespace", () => {
    const output = P.ws1(inputstream);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.equal(inputstream);
        break;
    }
  });
});

describe("nl parser", () => {
  it("should successfully match a UNIX newline", () => {
    const i = new CU.CharStream("\n");
    const output = P.nl(i);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("\n");
        expect(output.inputstream.toString()).to.equal("");
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should successfully match a Windows newline", () => {
    const i = new CU.CharStream("\r\n");
    const output = P.nl(i);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("\r\n");
        expect(output.inputstream.toString()).to.equal("");
        break;
      case "failure":
        assert.fail();
    }
  });

  it("should not match other whitespace", () => {
    const i = new CU.CharStream(" ");
    const output = P.nl(i);
    switch (output.tag) {
      case "success":
        assert.fail();
      case "failure":
        assert(true);
        break;
    }
  });

  it("should not match the empty string", () => {
    const i = new CU.CharStream("");
    const output = P.nl(i);
    switch (output.tag) {
      case "success":
        assert.fail();
      case "failure":
        assert(true);
        break;
    }
  });
});

describe("strSat parser", () => {
  it("should match the shortest, lexicographically first string in the given set that occurs in the input", () => {
    const i = new CU.CharStream("the quick brown fox jumps over the lazy dog");
    const strs = [
      "the",
      "quick",
      "brown",
      "fox",
      "jumps",
      "over",
      "lazy",
      "dog",
    ];
    const output = P.strSat(strs)(i);
    switch (output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("the");
        expect(output.inputstream.toString()).to.equal(
          " quick brown fox jumps over the lazy dog"
        );
        break;
      case "failure":
        assert.fail();
        break;
    }
  });

  it("should fail if there are no matches", () => {
    const i = new CU.CharStream("hello world");
    const strs = [
      "the",
      "quick",
      "brown",
      "fox",
      "jumps",
      "over",
      "lazy",
      "dog",
    ];
    const output = P.strSat(strs)(i);
    switch (output.tag) {
      case "success":
        assert.fail();
        break;
      case "failure":
        expect(output.inputstream).to.eql(i);
        break;
    }
  });
});

describe("matchWhile", () => {
  it("should match until a predicate returns false", () => {
    const input = new CU.CharStream("helloFunction3(");
    const output = P.matchWhile(ch => (ch.charCodeAt(0) > 48 && ch.charCodeAt(0) < 58) || (ch.charCodeAt(0) > 65 && ch.charCodeAt(0) < 91) || (ch.charCodeAt(0) > 97 && ch.charCodeAt(0) < 123))(input);
    switch(output.tag) {
      case "success":
        expect(output.result.toString()).to.equal("helloFunction3");
        break;
      case "failure":
        assert.fail();
    }
  });

  it ("shouldn't consume any input from a string that doesn't match", () => {
    const input = new CU.CharStream("!@&^%#*(");
    const output = P.matchWhile(ch => (ch.charCodeAt(0) > 48 && ch.charCodeAt(0) < 58) || (ch.charCodeAt(0) > 65 && ch.charCodeAt(0) < 91) || (ch.charCodeAt(0) > 97 && ch.charCodeAt(0) < 123))(input);
    switch(output.tag) {
      case "success":
        assert.fail();
      case "failure":
        assert(true);
    }
  });
});

describe("matchWhileCharCode", () => {
  it("should match until a predicate returns false", () => {
    const input = new CU.CharStream("helloFunction3(");
    const output = P.matchWhileCharCode(n => (n > 48 && n < 58) || (n > 65 && n < 91) || (n > 97 && n < 123))(input);
    const expectedMatch = new CU.CharStream("helloFunction3(", 0, 14, false);
    const expectedRem = new CU.CharStream("helloFunction3(", 14, 15, true);
    switch(output.tag) {
      case "success":
        expect(output.result).to.eql(expectedMatch);
        expect(output.inputstream).to.eql(expectedRem);
        break;
      case "failure":
        assert.fail();
    }
  });

  it ("shouldn't consume any input from a string that doesn't match", () => {
    const input = new CU.CharStream("!@&^%#*(");
    const output = P.matchWhileCharCode(n => (n > 48 && n < 58) || (n > 65 && n < 91) || (n > 97 && n < 123))(input);
    switch(output.tag) {
      case "success":
        assert.fail();
      case "failure":
        assert(true);
    }
  });
});
