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

export type GetFields<
  FieldsObject extends Record<string, FieldType>,
> = {
  [Field in keyof FieldsObject]: FieldBuilder<FieldsObject[Field]>;
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
}

export interface EventChangeValue<V = GenericValue, Name = string> {
  name: Name;
  value: V;
}

export type OnChangeFieldEvent<Field extends FieldType> = EventField<
  Field['value'],
  Field['name']
> & {
  field: FieldBuilder<Field>;
};

export type OnChangeField<Field extends FieldType> = (
  e: OnChangeFieldEvent<Field>,
  nativeEvent?: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => void | (() => void);

export type OnSetValue<Field extends FieldType> = (e: {
  lastValue: Field['value'];
  newValue: Field['value'];
  field: FieldBuilder<Field>;
}) => void;

export type GenericValue = any;
export type GlobalProps = { [key: string]: any };
export type transPosition = string | boolean;
export type ActiveStep = number;

export interface InitialState {
  ns?: string;
}

export type ValidateInputsValidator<
  Field extends FieldType,
  Fields extends PropsField<Field>[],
  FieldsObject extends Reducer<Fields>,
> = ValidationsFields<Field, Fields, FieldsObject>['validate'];

export interface FieldsProps<
  Field extends FieldType,
  Fields extends Field[],
  FieldsObject extends Reducer<Fields>,
> extends InitialState,
    ValidationsFields<Field, Fields, FieldsObject> {
  fields: [...Fields];
}

export type Rules = keyof typeof validators;

export interface Validation extends Message {
  rule: Rules;
  args?: any;
}

export type GenericFieldsBuilder = FieldsBuilder<
  FieldType,
  PropsField<FieldType>[],
  Reducer<PropsField<FieldType>[]>,
  true
>;

export interface AllPropsValidationFunction<Field extends FieldType> {
  readonly field: FieldBuilder<() => Field>;
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
export type ValidationFunction<Field extends FieldType> = (
  all: AllPropsValidationFunction<Field>,
) => ReturnValidationError | Promise<ReturnValidationError>;

export interface Validations<Field extends FieldType> {
  validate?: boolean;
  value: Field['value'];
  validations?: (Validation | ValidationFunction<Field>)[];
}

export type ValidationsField<Field extends FieldType> =
  Validations<Field>;

export interface ValidationsFields<
  Field extends FieldType,
  Fields extends PropsField<Field>[],
  FieldsObject extends Reducer<Fields>,
> {
  validate?:
    | boolean
    | ((
        inputsValidator: InputsValidator<Field, Fields, FieldsObject>,
      ) => boolean);
}

export type ChildrenRender = React.ReactElement<
  FieldProps<FieldType>,
  JSXElementConstructor<FieldProps<FieldType>>
>;

export type RenderField<Field extends FieldType> = (element: {
  children: ChildrenRender;
  props: FieldProps<Field>;
}) => React.CElement<any, any>;

export type ComponentField<Field extends FieldType> =
  React.ElementType<FieldProps<Field>>;

export interface ComponentErrorsProps<Field extends FieldType> {
  errors: ValidationErrors;
  field?: FieldBuilder<Field>;
}

export type ComponentErrors<Field extends FieldType> =
  React.ElementType<ComponentErrorsProps<Field>>;

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

export type InputPropsField<Field extends FieldType> =
  | ((
      a: {
        type: Field['type'];
        changeType: (
          type: Field['type'],
          callback?: () => void,
        ) => void;
      } & BaseRender<Field>,
    ) => Partial<Field & OutlinedInputProps>)
  | Partial<Field & OutlinedInputProps>;

export interface PropsFieldBase<Field extends FieldType> {
  type?: Field['type'];
  name: Field['name'];
  value: Field['value'];
  disabled?: boolean;
  defaultInputValue?: Field['value'];
  label?: Field['label'];
}

export interface FieldType {
  name: NameField;
  value: GenericValue;
  type?: TypeField;
  label?: LabelPropsField;
}

export interface PropsField<Field extends FieldType>
  extends PropsFieldBase<Field>,
    ValidationsField<Field>,
    InitialState {
  fullWidth?: boolean;
  errors?: ValidationErrors;
  autoComplete?: string;
  textFieldProps?: TextFieldPropsField;
}

export interface Validate<Field extends FieldType>
  extends Validations<Field> {
  state?: boolean;
}

export interface BaseRender<Field extends FieldType> {
  field: FieldBuilder<Field>;
}

export interface FieldProps<Field extends FieldType>
  extends BaseRender<Field> {
  onChangeField?(
    event: EventField<Field['value'], Field['name']>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);
  globalProps?: GlobalProps;
}

export interface InputProps<Field extends FieldType>
  extends FieldProps<Field> {
  type?: Field['type'];
}
