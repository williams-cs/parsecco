import { Option } from "space-lift";
export interface Edit {
    rootCause(): Option<ErrorType>;
    explanation(): string;
}
