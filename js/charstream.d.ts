export declare namespace CharUtil {
    class CharStream {
        readonly input: String;
        readonly startpos: number;
        readonly endpos: number;
        readonly hasEOF: boolean;
        constructor(s: String, startpos?: number, endpos?: number, hasEOF?: boolean);
        /**
         * Returns true of the end of the input has been reached.
         */
        isEOF(): boolean;
        /**
         * Returns a Javscript primitive string of the slice of input
         * represented by this CharStream.
         */
        toString(): string;
        /**
         * Returns a new CharStream representing the input from the
         * current start position to an end position num chars from
         * the current start position.  If startpos + num > endpos,
         * the current CharStream is returned.
         * @param num
         */
        peek(num: number): CharStream;
        /**
         * Returns a new CharStream representing the string after
         * seeking num characters from the current position.
         * @param num
         */
        seek(num: number): CharStream;
        /**
         * Returns a new CharStream representing the head of the input at
         * the current position.  Throws an exception if the CharStream is
         * empty.
         */
        head(): CharStream;
        /**
         * Returns a new CharStream representing the tail of the input at
         * the current position.  Throws an exception if the CharStream is
         * empty.
         */
        tail(): CharStream;
        /**
         * Returns true if the input at the current position is empty. Note
         * that a CharStream at the end of the input contains an empty
         * string but that an empty string may not be the end-of-file (i.e.,
         * isEOF is false).
         */
        isEmpty(): boolean;
        /**
         * Returns the number of characters remaining at
         * the current position.
         */
        length(): number;
        /**
         * Returns the substring between start and end at the
         * current position.
         * @param start the start index of the substring, inclusive
         * @param end the end index of the substring, exclusive
         */
        substring(start: number, end: number): CharStream;
        /**
         * Returns the concatenation of the current CharStream with
         * the given CharStream. Note: returned object does not
         * reuse original input string, and startpos and endpos
         * are reset. If the given CharStream contains EOF, the
         * concatenated CharStream will also contain EOF.
         * @param cs the CharStream to concat to this CharStream
         */
        concat(cs: CharStream): CharStream;
        /**
         * Concatenate an array of CharStream objects into a single
         * CharStream object.
         * @param css a CharStream[]
         */
        static concat(css: CharStream[]): CharStream;
    }
}
