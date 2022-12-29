import { JSXElementConstructor, ReactNode } from 'react';
import { GridSize, GridProps } from '@mui/material/Grid';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { StepperProps } from '@mui/material/Stepper';
import { Breakpoint } from '@mui/material/styles';
import { TextFieldProps } from '@mui/material/TextField';

import type {
  StepsBuilder,
  FieldsBuilder,
  FieldBuilder,
} from './utils/builders';
import {
  StepValidator,
  validators,
  InputValidator,
  InputsValidator,
} from './utils/validate';

export interface Message {
  ns?: string;
  message: string;
  /**
   * @description Properties to be passed to translate
   */
  props?: any;
}

export interface EventField<V = value> {
  target: { name: string; value: V; type?: string };
}

export type ChangeFieldCallback<V = value> = (
  e: (
    | EventField<V>
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) & {
    field?: FieldBuilder<V>;
  },
  callback?: () => void,
) => void | (() => void);

export type OnSetValue<V = value> = (e: {
  lastValue: V;
  newValue: V;
  field: FieldBuilder<V>;
}) => void;

export interface ChangeField<V = value> {
  changeField?: ChangeFieldCallback<V>;
}

export type value = any;
export type GlobalProps = () => { [key: string]: any };
export type transPosition = string | boolean;
export type ActiveStep = number;

export interface InitialState {
  ns?: string;
}

interface GlobalPropsInterface {
  globalProps?: GlobalProps;
  children?: ReactNode;
}

export interface InitialStateSteps
  extends InitialState,
    GlobalPropsInterface {
  validate?: boolean;
  steps: StepProps[];
  activeStep: ActiveStep;
  loading?: boolean;
  footerSteps?: {
    [key: number]: Record<
      'next' | 'back',
      Message & { state?: boolean }
    >;
  };
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
  action: EventField<V>['target'];
}

export interface ChangeValueFields<V = value> {
  fieldsBuilder: FieldsBuilder;
  action: EventField<V>['target'];
}

export interface ChangeValueSteps {
  activeStep: ActiveStep;
  steps: StepValidator[];
  action: ChangeValueFields['action'];
}

export type ValidateInputsValidator = ValidationsFields['validate'];

interface GridRender {
  /**
   * @default true
   */
  grid?: boolean;
}

export interface FieldsProps
  extends InitialState,
    GlobalPropsInterface,
    ValidationsFields,
    GridRender {
  fields: PropsField[];
}

export interface StepProps extends FieldsProps {
  label: Message | string;
  stepper?: boolean;
  elevation?: number;
}

export interface StepsRenderProps extends ChangeField {
  footerRender?: ({
    stepsLength,
    activeStep,
    footerSteps,
  }: {
    stepsLength: number;
    activeStep: ActiveStep;
    footerSteps: Partial<InitialStateSteps['footerSteps']>;
  }) => Record<'next' | 'back', Message & { state?: boolean }>;
  handleNextStep: (activeStep: ActiveStep) => void;
  handleBackStep: (activeStep: ActiveStep) => void;
  gridProps?: Omit<GridProps, 'children'>;
  stepperProps?: Omit<StepperProps, 'activeStep' | 'children'>;
  getSteps?: () => StepProps[];
  stepsBuild: InitialStateSteps;
  children: ReactNode;
}

export type Rules = keyof typeof validators;

export interface Validation extends Message {
  rule: Rules;
  args?: any;
}

export interface AllPropsValidationFunction<V = value>
  extends Partial<Validate<V>> {
  fieldsBuilder?: FieldsBuilder;
  field: FieldBuilder<V>;
  stepsBuilder?: StepsBuilder;
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
export type ValidationFunction<V = value> = (
  all: AllPropsValidationFunction<V>,
) => ReturnValidationError | Promise<ReturnValidationError>;

export interface Validations<V = value> {
  validate?: boolean | ((arg: any) => boolean);
  value: V;
  validations?: (Validation | ValidationFunction<V>)[];
}

export interface ValidationsField<V = value> extends Validations<V> {
  validate?:
    | boolean
    | ((inputValidator: InputValidator<V>) => boolean);
}

export interface ValidationsFields {
  validate?:
    | boolean
    | ((inputsValidator: InputsValidator) => boolean);
}

export type ChildrenRender = React.ReactElement<
  FieldProps,
  JSXElementConstructor<FieldProps>
>;

export type RenderField = (element: {
  children: ChildrenRender;
  props: FieldProps;
}) => React.CElement<any, any>;

export type ComponentField = React.ElementType<FieldProps>;

export interface ComponentErrorsProps<V = any> {
  errors: ValidationErrors;
  field?: FieldBuilder<V>;
}

export type ComponentErrors<V = any> = React.ElementType<
  ComponentErrorsProps<V>
>;

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

export function createField<V = value>(
  params: PropsField<V>,
): PropsField<V> {
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

export type InputPropsField =
  | ((
      a: {
        type: InputProps['type'];
        changeType: (
          type: InputProps['type'],
          callback?: () => void,
        ) => void;
      } & BaseRender,
    ) => Partial<OutlinedInputProps>)
  | Partial<OutlinedInputProps>;

export type BreakpointsField = Partial<
  Record<Breakpoint, boolean | GridSize>
>;

export interface PropsFieldBase<V = value>
  extends GlobalPropsInterface {
  type?: TypeField;
  name: string;
  value: V;
  disabled?: boolean;
  defaultInputValue?: V;
  label?: LabelPropsField;
  onChange?: ChangeFieldCallback<V>;
  onSetValue?: OnSetValue<V>;
}

export interface PropsField<V = value>
  extends PropsFieldBase<V>,
    ValidationsField<V>,
    InitialState,
    GridRender {
  render?: RenderField;
  fullWidth?: boolean;
  errors?: ValidationErrors;
  autoComplete?: string;
  InputProps?: InputPropsField;
  textFieldProps?: TextFieldPropsField;
  breakpoints?: BreakpointsField;
  component?: ComponentField;
  renderErrors?: ComponentErrors<V>;
}

export interface Validate<V = value> extends Validations<V> {
  state?: boolean;
}

export interface BaseRender<V = value> {
  field: FieldBuilder<V>;
}

export interface FieldProps<V = value>
  extends BaseRender<V>,
    ChangeField,
    GridRender {}

export interface InputProps extends FieldProps {
  type?: TypeTextField;
}

export interface BaseBuilder<V = value> extends ChangeField<V> {
  getSteps?: () => StepProps[];
  activeStep?: ActiveStep;
  getFields?: () => PropsField[];
  children?: ReactNode;
}

export type FieldRenderProps<V = value> = BaseBuilder<V> &
  BaseRender<V>;

export type FieldsRenderProps = FieldsProps & BaseBuilder;

export type FieldRenderComponentProps<V = value> =
  FieldRenderProps<V>;
