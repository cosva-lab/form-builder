import { JSXElementConstructor, ReactNode } from 'react';
import { GridSize, GridProps } from '@mui/material/Grid';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { StepperProps } from '@mui/material/Stepper';
import { Breakpoint } from '@mui/material/styles';
import { TextFieldProps } from '@mui/material/TextField';

import type { FieldsBuilder, FieldBuilder } from './utils/builders';
import {
  validators,
  InputValidator,
  InputsValidator,
} from './utils/validate';
import { Reducer } from './utils/types';

export type NameField = PropertyKey;

export type GetArrayValues<T> = T[keyof T][];

export type GetFields<FieldsObject> = {
  [Field in keyof FieldsObject]: FieldBuilder<
    FieldsObject[Field],
    Field
  >;
};

export interface Message {
  ns?: string;
  message: string;
  /**
   * @description Properties to be passed to translate
   */
  props?: any;
}

export interface EventField<
  V = value,
  Name extends NameField = string,
> {
  name: Name;
  value: V;
  type?: string;
}

export interface EventChangeValue<V = value, Name = string> {
  name: Name;
  value: V;
}

export type OnChangeFieldEvent<
  V = value,
  Name extends NameField = string,
> = EventField<V, Name> & {
  field: FieldBuilder<V, Name>;
};

export type OnChangeField<
  V = value,
  Name extends NameField = string,
> = (
  e: OnChangeFieldEvent<V, Name>,
  nativeEvent?: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => void | (() => void);

export type OnSetValue<
  V = value,
  Name extends NameField = string,
> = (e: {
  lastValue: V;
  newValue: V;
  field: FieldBuilder<V, Name>;
}) => void;

export type value = any;
export type GlobalProps = () => { [key: string]: any };
export type transPosition = string | boolean;
export type ActiveStep = number;

export interface InitialState {
  ns?: string;
}

export interface GlobalPropsInterface {
  globalProps?: GlobalProps;
  children?: ReactNode;
}

export declare function buildFields(a: PropsField[]): PropsField[];

export type FieldsAll = PropsField[];

export interface InitialStateFields
  extends InitialState,
    GlobalPropsInterface {
  validate?:
    | boolean
    | ((inputsValidator: InputsValidator) => boolean);
  fields: PropsField[];
}

export interface ChangeValueField<V = value> {
  field: FieldBuilder;
  action: EventField<V>;
}

export interface ChangeValueFields<V = value> {
  fieldsBuilder: FieldsBuilder;
  action: EventField<V>;
}

export type ValidateInputsValidator<
  Name extends NameField = string,
  Item extends PropsField<value, Name> = PropsField<value, Name>,
  Fields extends Item[] = Item[],
  FieldsObject = Reducer<Fields>,
> = ValidationsFields<Name, Item, Fields, FieldsObject>['validate'];

export interface GridRender {
  /**
   * @default true
   */
  grid?: boolean;
}

export interface FieldsProps<
  Name extends NameField = string,
  Item extends PropsField<value, Name> = PropsField<value, Name>,
  Fields extends Item[] = Item[],
  FieldsObject = Reducer<Fields>,
> extends InitialState,
    GlobalPropsInterface,
    ValidationsFields<Name, Item, Fields, FieldsObject>,
    GridRender {
  fields: [...Fields];
}

export type Rules = keyof typeof validators;

export interface Validation extends Message {
  rule: Rules;
  args?: any;
}

export type GenericFieldsBuilder = FieldsBuilder<
  string,
  PropsField,
  PropsField[],
  Record<string, value>,
  true
>;

export interface AllPropsValidationFunction<
  V = value,
  Name extends NameField = string,
> extends Partial<Validate<V, Name>> {
  fieldsBuilder?: GenericFieldsBuilder;
  field: FieldBuilder<V, Name>;
  activeStep?: ActiveStep;
}

/**
 * @description
 * Defines the map of errors returned from failed validation checks.
 *
 * @publicApi
 */
export type ValidationError =
  | string
  | React.ReactElement<any>
  | Message;

export type ValidationErrors = ValidationError[];
export type ReturnValidationError =
  | undefined
  | void
  | ValidationError;
export type ValidationFunction<
  V = value,
  Name extends NameField = string,
> = (
  all: AllPropsValidationFunction<V, Name>,
) => ReturnValidationError | Promise<ReturnValidationError>;

export interface Validations<
  V = value,
  Name extends NameField = string,
> {
  validate?: boolean | ((arg: any) => boolean);
  value: V;
  validations?: (Validation | ValidationFunction<V, Name>)[];
}

export interface ValidationsField<
  V = value,
  Name extends NameField = string,
> extends Validations<V, Name> {
  validate?:
    | boolean
    | ((inputValidator: InputValidator<V, Name>) => boolean);
}

export interface ValidationsFields<
  Name extends NameField = string,
  Item extends PropsField<value, Name> = PropsField<value, Name>,
  Fields extends Item[] = Item[],
  FieldsObject = Reducer<Fields>,
> {
  validate?:
    | boolean
    | ((
        inputsValidator: InputsValidator<
          Name,
          Item,
          Fields,
          FieldsObject
        >,
      ) => boolean);
}

export type ChildrenRender = React.ReactElement<
  FieldProps,
  JSXElementConstructor<FieldProps>
>;

export type RenderField<
  V = value,
  Name extends NameField = string,
> = (element: {
  children: ChildrenRender;
  props: FieldProps<V, Name>;
}) => React.CElement<any, any>;

export type ComponentField<
  V = value,
  Name extends NameField = string,
> = React.ElementType<FieldProps<V, Name>>;

export interface ComponentErrorsProps<
  V = value,
  Name extends NameField = string,
> {
  errors: ValidationErrors;
  field?: FieldBuilder<V, Name>;
}

export type ComponentErrors<
  V = value,
  Name extends NameField = string,
> = React.ElementType<ComponentErrorsProps<V, Name>>;

export type TypeTextField =
  | 'date'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  | 'datetime-local';

export type TypeField = 'component' | TypeTextField;

export function createField<
  Name extends NameField = string,
  V = value,
>(params: PropsField<V, Name>): PropsField<V, Name> {
  return params;
}
export type TextFieldPropsField = Pick<
  TextFieldProps,
  | 'multiline'
  | 'rows'
  | 'autoComplete'
  | 'autoFocus'
  | 'color'
  | 'defaultValue'
  | 'disabled'
  | 'FormHelperTextProps'
  | 'fullWidth'
  | 'helperText'
  | 'id'
  | 'InputLabelProps'
  | 'inputRef'
  | 'label'
  | 'margin'
  | 'placeholder'
  | 'required'
  | 'select'
  | 'SelectProps'
>;

export type LabelPropsField =
  | string
  | React.ReactElement<any>
  | Message;

export type InputPropsField<
  V = value,
  Name extends NameField = string,
> =
  | ((
      a: {
        type: InputProps['type'];
        changeType: (
          type: InputProps['type'],
          callback?: () => void,
        ) => void;
      } & BaseRender<V, Name>,
    ) => Partial<OutlinedInputProps>)
  | Partial<OutlinedInputProps>;

export type BreakpointsField = Partial<
  Record<Breakpoint, boolean | GridSize>
>;

export interface PropsFieldBase<
  V = value,
  Name extends NameField = string,
> extends GlobalPropsInterface {
  type?: TypeField;
  name: Name;
  value: V;
  disabled?: boolean;
  defaultInputValue?: V;
  label?: LabelPropsField;
  onChange?: OnChangeField<V, Name>;
  onSetValue?: OnSetValue<V, Name>;
}

export interface PropsField<
  V = value,
  Name extends NameField = string,
> extends PropsFieldBase<V, Name>,
    ValidationsField<V, Name>,
    InitialState,
    GridRender {
  render?: RenderField<V, Name>;
  fullWidth?: boolean;
  errors?: ValidationErrors;
  autoComplete?: string;
  InputProps?: InputPropsField<V, Name>;
  textFieldProps?: TextFieldPropsField;
  breakpoints?: BreakpointsField;
  component?: ComponentField<V, Name>;
  renderErrors?: ComponentErrors<V, Name>;
}

export interface Validate<V = value, Name extends NameField = string>
  extends Validations<V, Name> {
  state?: boolean;
}

export interface BaseRender<
  V = value,
  Name extends NameField = string,
> {
  field: FieldBuilder<V, Name>;
}

export interface FieldProps<V = value, Name extends NameField = any>
  extends BaseRender<V, Name>,
    GridRender {
  onChangeField?(
    event: EventField<V, Name>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);
}

export interface InputProps<
  Name extends NameField = string,
  V = value,
> extends FieldProps<V, Name> {
  type?: TypeTextField;
}
