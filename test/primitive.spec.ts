import '../lib/main';
import { expect } from 'chai';
import 'mocha';
import { Failure } from '../lib/main';

describe('Failure constructor', () => {

  it('should consume none of the input stream', () => {
    const inputstream = "helloworld";
    const result = new Failure(inputstream);
    expect(result.inputstream).to.equal(inputstream);
  });

});