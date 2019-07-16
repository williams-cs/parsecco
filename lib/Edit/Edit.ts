import { ErrorType } from "../Errors/ErrorType";
import { levenshteinDist } from "./Levenshtein";
import { StringError,CharError, DigitError, ItemError, LetterError, SatError,
         WSError, BetweenLeftError, BetweenRightError } from "../Errors/ErrorIndex";
const jslevenshtein = require('js-levenshtein');

export class Edit {
    private _input: string;
    private _error: ErrorType;
    private _prevEdit: number;
    private _output: [number,string];

    constructor(input: string, error: ErrorType, prevEdit: number = 0){
        this._input = input;
        this._error = error;
        this._prevEdit = prevEdit;
        this._output = [0,""];
    }

    /*
    Given a particular error, it creates a finite 
    space of most possible error correcting replacements.
    All of items in the search space are possible fixes
    to the error
    */
    // private searchSpace(error: ErrorType): string[]{
    //     return error.fix();
    // }

    /*
    Returns the minimum edit distance of a string that 
    fixes the error, and returns that string. The complexity 
    is O(kmn), where k is the size of the search space.
    Returns a tuple of the minimum edit distance and 
    alternate string associated
    */
    minFix(space: string[]): [number, string]{
        let min: number = levenshteinDist(this._input, space[0]);
        let closestStr: string = space[0];
        for(let str in space){
            let curr: number = levenshteinDist(this._input,str);
            if (curr < min){
                min = curr
                closestStr = str
            }
            if (min == 1){
                break;
            }
        }
        this._output = [min + this._prevEdit,closestStr]
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
