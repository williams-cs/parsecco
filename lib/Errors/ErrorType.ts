import { Option, Some, None, tuple} from 'space-lift';

export interface ErrorType {
    rootCause() : Option<ErrorType>
    explanation() : string
}