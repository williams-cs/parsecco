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