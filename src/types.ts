import { JSXElementConstructor } from 'react';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { TextFieldProps } from '@mui/material/TextField';

import type { FieldsBuilder } from './utils/builders/FieldsBuilder';
import type { FieldBuilder } from './utils/builders/FieldBuilder';
import {
  validators,
  InputsValidator,
  InputValidator,
} from './utils/validate';

export type NameField = PropertyKey;

export type GetArrayValues<T> = T[keyof T][];

export type Simplify<T> = T extends Record<string, any>
  ? { [K in keyof T]: T[K] }
  : T;

export type GetFieldsValue<
  Fields extends readonly {
    name: NameField;
    value: any;
  }[],
> = Simplify<{
  [F in Fields[number] as F['name']]: F['value'];
}>;

export type GetFields<FieldsObject> = {
  [Field in keyof FieldsObject]: FieldsObject extends Record<
    string,
    FieldType
  >
    ? FieldsObject[Field]
    : never;
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
  Fields extends FieldBuilder<any>[],
> = ValidationsFields<Fields>['validate'];

export type FieldsToObject<
  Fields extends {
    name: NameField;
    value: any;
  }[],
> = {
  [F in Fields[number] as F['name']]: F;
};

export type FieldsProps<Fields extends FieldBuilder<any>[]> = {
  fields: [...Fields];
} & ValidationsFields<Fields> &
  InitialState;

export type Rules = keyof typeof validators;

export interface Validation extends Message {
  rule: Rules;
  args?: any;
}

export type GenericFieldsBuilder = FieldsBuilder<FieldBuilder<any>[]>;

export interface AllPropsValidationFunction<Field extends FieldType> {
  field: FieldBuilder<Field>;
  validate: boolean;
  value: Field['value'];
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

export type FieldError =
  | ValidationError
  | Record<string, any>
  | undefined
  | void;

export type FieldErrors = undefined | void | FieldError[];

export type ValidationFunction<Field extends FieldType> = (
  all: AllPropsValidationFunction<Field>,
) => FieldError | Promise<FieldError>;

export interface ValidationsProps<Field extends FieldType> {
  validate?: ValidateField<Field>;
  value: Field['value'];
  validations?: Field['validations'];
}

export type ValidateField<Field extends FieldType> =
  | boolean
  | ((arg: InputValidator<Field>) => boolean);

export interface ValidationsFields<
  Fields extends FieldBuilder<any>[],
> {
  validate?:
    | boolean
    | ((inputsValidator: InputsValidator<Fields>) => boolean);
}

export type ChildrenRender = React.ReactElement<
  FieldProps<any, any, any>,
  JSXElementConstructor<FieldProps<any, any, any>>
>;

export type RenderField<Field extends FieldType> = (element: {
  children: ChildrenRender;
  props: FieldProps<
    Field['value'],
    Field['name'],
    Field['validations']
  >;
}) => React.CElement<any, any>;

export type ComponentField<Field extends FieldType> =
  React.ElementType<
    FieldProps<Field['value'], Field['name'], Field['validations']>
  >;

export interface ComponentErrorsProps<Field extends PropsField> {
  errors: any[];
  field?: FieldBuilder<Field>;
}

export type ComponentErrors<Field extends PropsField> =
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
  | ((a: {
      type: TypeField;
      changeType: (type: TypeField, callback?: () => void) => void;
      field: FieldBuilder<Field>;
    }) => Partial<Field & OutlinedInputProps>)
  | Partial<Field & OutlinedInputProps>;

export type FieldType<
  Name extends NameField = NameField,
  Value = any,
  Validations = CommonValidations<any> | undefined,
> = {
  name: Name;
  value: Value;
  validations?: NormalizeArray<Validations>;
};

type WithConditionalValidations<Field> = Field extends {
  validations?: infer V;
}
  ? { validations?: V }
  : Field extends { validations: infer V }
  ? { validations: V }
  : { validations: undefined };

export type PropsFieldBase<Field extends FieldType> = {
  readonly name: Field['name'];
  value: Field['value'];
  type?: TypeField;
  label?: LabelPropsField;
  disabled?: boolean;
  defaultInputValue?: Field['value'];
  onChange?: OnChangeField<Field>;
  onSetValue?: OnSetValue<Field>;
} & WithConditionalValidations<Field>;

export type CommonValidations<Field extends FieldType = any> = (
  | Validation
  | ValidationFunction<Field>
)[];

type ValidationResult<V> = V extends Promise<infer R>
  ? R
  : V extends (...args: any[]) => infer R
  ? Awaited<R>
  : V;

type NormalizeArray<T> = T extends readonly (infer U)[] ? U[] : T;
export type GetErrors<
  Validations extends CommonValidations | undefined,
> = Validations extends undefined
  ? undefined
  : Validations extends Array<any>
  ? NormalizeArray<{
      [K in keyof Validations]: ValidationResult<Validations[K]>;
    }>
  : never;

export type PropsField<
  Field extends FieldType<any, any, any> = FieldType<any, any, any>,
> = PropsFieldBase<Field> &
  InitialState & {
    validate?: ValidateField<Field>;
    render?: RenderField<Field>;
    InputProps?: InputPropsField<Field>;
    component?: ComponentField<Field>;
    disabled?: boolean;
    defaultInputValue?: Field['value'];
    fullWidth?: boolean;
    errors?: GetErrors<Field['validations']> | [];
    autoComplete?: string;
    textFieldProps?: TextFieldPropsField;
  };

export interface Validate<Field extends FieldType<any, any, any>>
  extends ValidationsProps<Field> {
  state?: boolean;
}

export interface FieldProps<
  Value = any,
  Name extends NameField = any,
  Validations extends CommonValidations | undefined =
    | undefined
    | any[],
> {
  field: FieldBuilder<Simplify<FieldType<Name, Value, Validations>>>;

  onChangeField?(
    event: EventField<Value, Name>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);
  globalProps?: GlobalProps;
}
