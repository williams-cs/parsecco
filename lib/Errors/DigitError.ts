import { ErrorType } from "./ErrorType";
import { Option, Some, None } from "space-lift";

export class DigitError implements ErrorType {

    rootCause() : Option<ErrorType> {
        return None;
    }

    explanation() : string {
        return "number";
    }

    fix(): string[]{
        let num = ["0","1","2","3","4","5","6","7","8","9"];
        //let rand = list[Math.floor(Math.random() * list.length)];
        return num
    }

    toString() : string {
        return "DigitError"; 
    }
}