import { Option } from 'space-lift';
export interface ErrorType {
    rootCause(): Option<ErrorType>;
    explanation(): string;
}
