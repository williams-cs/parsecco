import * as pants from '../lib/main';
import { assert,expect } from 'chai';
import 'mocha';

describe('Failure constructor', () => {
  it('should consume none of the input stream', () => {
    const inputstream = "helloworld";
    const output = new pants.Failure(inputstream);
    expect(output.inputstream).to.equal(inputstream);
  });
});

describe('Result combinator', () => {
    it('should succeed without consuming any input', () => {
        const inputstream = "helloworld";
        const output = pants.result(true)(inputstream);
        expect(output.inputstream).to.equal(inputstream);
    });
});

describe('Zero combinator', () => {
    it('should fail and consume no input', () => {
        const inputstream = "helloworld";
        const output = pants.zero<string>()(inputstream);
        expect(output.inputstream).to.equal(inputstream);
        // TODO: this test does not work for non-obvious reasons
        // switch(output.tag) {
        //     case "failure": assert(true);
        //     default:
        //         console.log(output.tag);
        //         assert.fail();
        // }
    });
});

describe('Item combinator', () => {
    it('should successfully consume input when there is input to consume', () => {
        const inputstream = "helloworld";
        const output = pants.item()(inputstream);
        expect(output.inputstream).to.equal("elloworld");
    });

    it('should fail to consume input when there is no input to consume', () => {
        const inputstream = "";
        const output = pants.item()(inputstream);
        expect(output.inputstream).to.equal("");
        // TODO: check for failure object
    });
});

describe('Sat combinator', () => {
    it('should successfully consume input that matches a predicate', () => {
        const inputstream = "helloworld";
        const output = pants.sat((s) => s === "h")(inputstream);
        expect(output.inputstream).to.equal("elloworld");
        switch(output.tag) {
            case "success": expect(output.result).to.equal("h");
            case "failure": assert.fail();
        }
    })
})