import { Option } from "space-lift";
import { ErrorType } from "../Errors/ErrorType";

export class Edit {
    private _input: string;
    private _error: ErrorType;

    constructor(input: string, error: ErrorType){
        this._input = input;
        this._error = error;
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
    heuristics. Returns both the minimum edit distance
    of a string that fixes the error, and returns that 
    string. The complexity is O(kmn), where k is the 
    size of the search space.
    */
    minEdit(error: ErrorType): [number, string]{
        return [2,"k"];
    }

    /*
    Returns the alternate string that satisfied the 
    error
    */
    alternateString(): string{
        return this.minEdit(this._error)[1];
    }

}
