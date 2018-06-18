export default class CharStream {
    public readonly input : String
    public readonly pos : number

    constructor(s: String, pos?: number) {
        this.input = s;
        
        if (pos == undefined) {
            this.pos = 0;           // not specified; set default
        } else if (pos > s.length) {
            this.pos = s.length;    // seek too far; set EOF
        } else {
            this.pos = pos;         // specified and in bounds
        }
    }

    public isEOF() : boolean {
        return this.pos == this.input.length;
    }

    public toString() : String {
        return this.input.substring(this.pos, this.input.length);
    }

    public seek(num: number) : CharStream {
        return new CharStream(this.input, this.pos + num);
    }
}