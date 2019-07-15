import { Option } from "space-lift";
export interface Edit {
    rootCause(): Option<Edit>;
    explanation(): string;
}
