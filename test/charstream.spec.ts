import {CharUtil} from '../lib/charstream';
import { assert, expect } from 'chai';
import 'mocha';

describe('CharStream', () => {
  it('should be instantiable with just a string and toString should produce the right output', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    expect(cs.toString()).to.equal(s);
  });

  it('should produce a new CharUtil.CharStream when seeking', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.seek(5);
    expect(cs2.toString()).to.equal("world");
  });

  it('should produce a new CharUtil.CharStream when seeking twice', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.seek(5);
    const cs3 = cs2.seek(2);
    expect(cs3.toString()).to.equal("rld");
  });

  it('should always store a reference to (not a copy of) the original string', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.seek(5);
    assert(cs.input === cs2.input);
  });

  it('should return EOF when the end of the input is reached', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.seek(10);
    expect(cs2.isEOF()).to.equal(true);
  });

  it('should not be possible to seek too far', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.seek(100);
    expect(cs2.isEOF()).to.equal(true);
    expect(cs2.startpos).to.equal(s.length);
  });

  it('should be possible to obtain the head of a non-empty string', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.head();
    expect(cs2.toString()).to.equal("h");
  });

  it('should not be possible to obtain the head of an empty string', () => {
    const s = "";
    const cs = new CharUtil.CharStream(s);
    expect(function () { cs.head() }).to.throw();
  });

  it('should be possible to obtain the tail of a non-empty string', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.tail();
    expect(cs2.toString()).to.equal("elloworld");
  });

  it('should not be possible to obtain the tail of an empty string', () => {
    const s = "";
    const cs = new CharUtil.CharStream(s);
    expect(function () { cs.tail() }).to.throw();
  });

  it('at the EOF should also be empty', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const cs2 = cs.seek(10);
    expect(cs2.isEmpty()).to.equal(true);
  });

  it('should be empty when an empty slice is taken', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s, 5, 5);
    expect(cs.isEmpty()).to.equal(true);
  });

  it('should have a length method that works the same as string length', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    expect(cs.length()).to.equal(s.length);
  });

  it('should have length zero for the empty slice', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s, 5, 5);
    expect(cs.length()).to.equal(0);
  });

  it('should return the same substring as string.substring', () => {
    const s = "helloworld";
    const cs = new CharUtil.CharStream(s);
    const e = s.substring(2,s.length);
    const e2 = cs.substring(2,cs.length());
    expect(e2.toString()).to.equal(e);
  });

  it('should concatenate properly', () => {
    const a = "hello";
    const b = "world";
    const a_cs = new CharUtil.CharStream(a);
    const b_cs = new CharUtil.CharStream(b);
    expect(a_cs.concat(b_cs).toString()).to.equal(a+b);
  });
});