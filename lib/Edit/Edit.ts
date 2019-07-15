import { ErrorType } from "../Errors/ErrorType";

export class Edit {
    private _input: string;
    private _error: ErrorType;
    private _output: [number,string];

    constructor(input: string, error: ErrorType){
        this._input = input;
        this._error = error;
        this._output = [0,""];
    }

    /*
    Performs one instance of a levenshtein calculation 
    given two strings, and returns the distance. The 
    complexity of this method is O(mn), where m and n 
    are the lengths of the current and optimal string
    */
    private levenshtein(curr: string, opt:string): number {

        return 2;
    }

    /*
    Given a particular error, it creates a non-infinite 
    space to search for the minimum edit distance via 
    heuristics. 
    */
    private searchSpace(error: ErrorType): string[]{

        return ["a","2"]
    }

    /*
    Returns the minimum edit distance of a string that 
    fixes the error, and returns that string. The complexity 
    is O(kmn), where k is the size of the search space.
    */
    minEdit(): [number, string]{
        let s: this.searchSpace
        this._output = [2,"k"]
        return this._output;
    }



    // Not sure if necessary given that minEdit needs to run before these can be called
    /*
    Returns the alternate string that satisfied the 
    error. Requires a call of minEdit()
    */
    alternateString(): string{
        return this._output[1];
    }

    /*
    Returns the distance of the minimum edit 
    */
    minDist(): number{
        return this._output[0];
    }

}
