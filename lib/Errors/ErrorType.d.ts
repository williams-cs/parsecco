import { Option } from 'space-lift';
export interface ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
    minEdit(input: string, expectedStr: string): number;
    expectedStr(): string;
}
