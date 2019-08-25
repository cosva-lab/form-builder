import StepsBuilder from './StepsBuilder';
import FormBuilder from './FormBuilder';
export interface State<T> {
  fieldsRender: T;
}
export declare type Component<T> = React.Component<unknown, State<T>>;

export declare type StateFormBuilder = State<FormBuilder>;
export declare type ComponentFormBuilder = Component<FormBuilder>;

export declare type StateStepsBuilder = State<StepsBuilder>;
export declare type ComponentStepsBuilder = Component<StepsBuilder>;
