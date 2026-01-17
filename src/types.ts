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

export type OnChangeFieldEvent<Field extends PropsField> = EventField<
  Field['value'],
  Field['name']
> & {
  field: FieldBuilder<Field>;
};

export type OnChangeField<Field extends PropsField> = (
  e: OnChangeFieldEvent<Field>,
  nativeEvent?: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => void | (() => void);

export type OnSetValue<
  Field extends PropsField,
  Validations extends CommonValidations | undefined = undefined,
> = (e: {
  lastValue: Field['value'];
  newValue: Field['value'];
  field: FieldBuilder<Field, Validations>;
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

export type FieldsProps<Fields extends FieldBuilder<any, any>[]> = {
  fields: [...Fields];
} & ValidationsFields<Fields> &
  InitialState;

export type Rules = keyof typeof validators;

export interface Validation extends Message {
  rule: Rules;
  args?: any;
}

export type GenericFieldsBuilder = FieldsBuilder<FieldBuilder<any>[]>;

export interface AllPropsValidationFunction<
  Field extends PropsField,
> {
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

export type ValidationErrors<Field extends FieldBuilder<any>> =
  Field['errors'];

export type ReturnValidationError =
  | undefined
  | void
  | ValidationError
  | Record<string, any>;
export type ValidationFunction<Field extends PropsField> = (
  all: AllPropsValidationFunction<Field>,
) => ReturnValidationError | Promise<ReturnValidationError>;

export interface ValidationsProps<
  Field extends PropsField,
  V extends CommonValidations | undefined = undefined,
> {
  validate?: ValidateField<Field, V>;
  value: Field['value'];
  validations?: V;
}

export type ValidateField<
  Field extends FieldType,
  Validations extends CommonValidations | undefined = undefined,
> = boolean | ((arg: InputValidator<Field, Validations>) => boolean);

export interface ValidationsFields<
  Fields extends FieldBuilder<any>[],
> {
  validate?:
    | boolean
    | ((inputsValidator: InputsValidator<Fields>) => boolean);
}

export type ChildrenRender = React.ReactElement<
  FieldProps<FieldType>,
  JSXElementConstructor<FieldProps<FieldType>>
>;

export type RenderField<Field extends PropsField> = (element: {
  children: ChildrenRender;
  props: FieldProps<Field>;
}) => React.CElement<any, any>;

export type ComponentField<Field extends PropsField> =
  React.ElementType<FieldProps<Field>>;

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

export type InputPropsField<Field extends PropsField> =
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

export interface FieldType<
  Name extends NameField = NameField,
  Value = any,
> {
  name: Name;
  value: Value;
  type?: TypeField;
  label?: LabelPropsField;
}

export interface PropsFieldBase<
  Field extends PropsField,
  Validations extends CommonValidations | undefined = undefined,
> {
  readonly name: Field['name'];
  value: Field['value'];
  type?: Field['type'];
  disabled?: boolean;
  defaultInputValue?: Field['value'];
  label?: Field['label'];
  onChange?: OnChangeField<Field>;
  onSetValue?: OnSetValue<Field, Validations>;
}

export type CommonValidations = (
  | Validation
  | ValidationFunction<any>
)[];

type ValidationResult<V> = V extends Promise<infer R>
  ? R
  : V extends (...args: any[]) => infer R
  ? Awaited<R>
  : V;

export type GetErrors<
  Validations extends CommonValidations | undefined,
> = Validations extends undefined
  ? undefined
  : {
      [K in keyof Validations]: ValidationResult<Validations[K]>;
    };

export type PropsField<
  Field extends FieldType = FieldType,
  Validations extends CommonValidations | undefined = undefined,
> = { validations?: Validations } & PropsFieldBase<
  Field,
  Validations
> &
  InitialState & {
    validate?: ValidateField<Field, Validations>;
    render?: RenderField<Field>;
    InputProps?: InputPropsField<Field>;
    component?: ComponentField<Field>;
    disabled?: boolean;
    defaultInputValue?: Field['value'];
    label?: Field['label'];
    fullWidth?: boolean;
    errors?: GetErrors<Validations> | [];
    autoComplete?: string;
    textFieldProps?: TextFieldPropsField;
  };

export interface Validate<
  Field extends PropsField,
  V extends CommonValidations | undefined = undefined,
> extends ValidationsProps<Field, V> {
  state?: boolean;
}

export interface BaseRender<Field extends PropsField> {
  field: FieldBuilder<Field>;
}

export interface FieldProps<Field extends PropsField>
  extends BaseRender<Field> {
  onChangeField?(
    event: EventField<Field['value'], Field['name']>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);
  globalProps?: GlobalProps;
}

export interface InputProps<Field extends PropsField>
  extends FieldProps<Field> {
  type?: Field['type'];
}
