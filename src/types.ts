import { JSXElementConstructor, ReactNode } from 'react';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
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
    Field,
    LabelPropsField
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

export interface EventField<V, Name extends NameField> {
  name: Name;
  value: V;
  type?: string;
}

export interface EventChangeValue<V = value, Name = string> {
  name: Name;
  value: V;
}

export type OnChangeFieldEvent<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> = EventField<V, Name> & {
  field: FieldBuilder<V, Name, Label>;
};

export type OnChangeField<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> = (
  e: OnChangeFieldEvent<V, Name, Label>,
  nativeEvent?: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => void | (() => void);

export type OnSetValue<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> = (e: {
  lastValue: V;
  newValue: V;
  field: FieldBuilder<V, Name, Label>;
}) => void;

export type value = any;
export type GlobalProps = { [key: string]: any };
export type transPosition = string | boolean;
export type ActiveStep = number;

export interface InitialState {
  ns?: string;
}

export type ValidateInputsValidator<
  Name extends NameField = string,
  Item extends PropsField<value, Name> = PropsField<value, Name>,
  Fields extends Item[] = Item[],
  FieldsObject = Reducer<Fields>,
> = ValidationsFields<Name, Item, Fields, FieldsObject>['validate'];

export interface FieldsProps<
  Name extends NameField = string,
  Item extends PropsField<value, Name> = PropsField<value, Name>,
  Fields extends Item[] = Item[],
  FieldsObject = Reducer<Fields>,
> extends InitialState,
    ValidationsFields<Name, Item, Fields, FieldsObject> {
  fields: [...Fields];
}

export type Rules = keyof typeof validators;

export interface Validation extends Message {
  rule: Rules;
  args?: any;
}

export type GenericFieldsBuilder = FieldsBuilder<
  string,
  PropsField<value, any, any>,
  PropsField<value, any, any>[],
  Record<string, value>,
  true
>;

export interface AllPropsValidationFunction<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> extends Partial<Validate<V, Name, Label>> {
  fieldsBuilder?: GenericFieldsBuilder;
  field: FieldBuilder<V, Name, Label>;
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
  V,
  Name extends NameField = NameField,
  Label extends LabelPropsField = any,
> = (
  all: AllPropsValidationFunction<V, Name, Label>,
) => ReturnValidationError | Promise<ReturnValidationError>;

export interface Validations<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> {
  validate?: boolean | ((arg: any) => boolean);
  value: V;
  validations?: (Validation | ValidationFunction<V, Name, Label>)[];
}

export interface ValidationsField<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> extends Validations<V, Name, Label> {
  validate?:
    | boolean
    | ((inputValidator: InputValidator<V, Name, Label>) => boolean);
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
  FieldProps<unknown, string, LabelPropsField>,
  JSXElementConstructor<FieldProps<unknown, string, LabelPropsField>>
>;

export type RenderField<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> = (element: {
  children: ChildrenRender;
  props: FieldProps<V, Name, Label>;
}) => React.CElement<any, any>;

export type ComponentField<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> = React.ElementType<FieldProps<V, Name, Label>>;

export interface ComponentErrorsProps<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> {
  errors: ValidationErrors;
  field?: FieldBuilder<V, Name, Label>;
}

export type ComponentErrors<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> = React.ElementType<ComponentErrorsProps<V, Name, Label>>;

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
  | null
  | undefined
  | React.ReactElement<any>
  | Message;

export type InputPropsField<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> =
  | ((
      a: {
        type: InputProps<V, Name, Label>['type'];
        changeType: (
          type: InputProps<V, Name, Label>['type'],
          callback?: () => void,
        ) => void;
      } & BaseRender<V, Name, Label>,
    ) => Partial<OutlinedInputProps>)
  | Partial<OutlinedInputProps>;

export interface PropsFieldBase<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> {
  type?: TypeField;
  name: Name;
  value: V;
  disabled?: boolean;
  defaultInputValue?: V;
  label?: Label;
  onChange?: OnChangeField<V, Name, Label>;
  onSetValue?: OnSetValue<V, Name, Label>;
}

export interface PropsField<
  V,
  Name extends NameField,
  Label extends LabelPropsField = LabelPropsField,
> extends PropsFieldBase<V, Name, Label>,
    ValidationsField<V, Name, Label>,
    InitialState {
  render?: RenderField<V, Name, Label>;
  fullWidth?: boolean;
  errors?: ValidationErrors;
  autoComplete?: string;
  InputProps?: InputPropsField<V, Name, Label>;
  textFieldProps?: TextFieldPropsField;
  component?: ComponentField<V, Name, Label>;
  renderErrors?: ComponentErrors<V, Name, Label>;
}

export interface Validate<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> extends Validations<V, Name, Label> {
  state?: boolean;
}

export interface BaseRender<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> {
  field: FieldBuilder<V, Name, Label>;
}

export interface FieldProps<
  V,
  Name extends NameField = any,
  Label extends LabelPropsField = any,
> extends BaseRender<V, Name, Label> {
  onChangeField?(
    event: EventField<V, Name>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);
  globalProps?: GlobalProps;
}

export interface InputProps<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> extends FieldProps<V, Name, Label> {
  type?: TypeTextField;
}
