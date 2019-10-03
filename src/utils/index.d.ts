import StepsBuilder from './StepsBuilder';
import FieldsBuilder from './FieldsBuilder';
export interface State<T> {
  fieldsRender: T;
}
export declare type Component<T> = React.Component<unknown, State<T>>;

export declare type StateFormBuilder = State<FieldsBuilder>;
export declare type ComponentFormBuilder = Component<FieldsBuilder>;

export declare type StateStepsBuilder = State<StepsBuilder>;
export declare type ComponentStepsBuilder = Component<StepsBuilder>;
