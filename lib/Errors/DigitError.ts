import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";
import { metriclcs } from "../Edit/MetricLcs";

export class DigitError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "number";
    }

    minEdit(input: string, expectedStr: string) : number {
        return metriclcs(input, expectedStr);
    }

    expectedStr() : string {
        return "0" ;
    }

    toString() : string {
        return "DigitError"; 
    }
}