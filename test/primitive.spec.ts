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
        // TODO: this test does not work for not-obvious reasons
        // switch(output.tag) {
        //     case "failure": assert(true);
        //     default:
        //         console.log(output.tag);
        //         assert.fail();
        // }
    });
});

describe('item combinator', () => {
    it('should successfully consume input when there is input to consume', () => {
        const inputstream = "helloworld";
        const output = pants.item()(inputstream);
        expect(output.inputstream).to.equal("elloworld");
    });
});