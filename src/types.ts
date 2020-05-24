import { JSXElementConstructor } from 'react';
import { GridSize, GridProps } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import { StepperProps } from '@material-ui/core/Stepper';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { TextFieldProps } from '@material-ui/core/TextField';

import { ActionsFiles } from './inputsTypes/FileInput/Props';
import {
  StepsBuilder,
  StepValidator,
  FieldsBuilder,
  FieldBuilder,
} from './utils';
import {
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

export type changeField<V = value> = (
  e: (
    | EventField<V>
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) & {
    fieldProxy?: FieldBuilder<V>;
  },
  callback?: () => void,
) => void | (() => void);

export type onSetValue<V = value> = (e: {
  lastValue: V;
  newValue: V;
  field: FieldBuilder<V>;
}) => void;

export interface ChangeField<V = value> {
  changeField: changeField<V>;
}

export type value = any;
export type GlobalProps = () => { [key: string]: any };
export type transPosition = string | boolean;
export type activeStep = number;

export interface InitialState {
  ns?: string;
}

interface GlobalPropsInterface {
  globalProps?: GlobalProps;
}

export interface InitialStateSteps
  extends InitialState,
    GlobalPropsInterface {
  validate?: boolean;
  steps: StepProps[];
  activeStep: activeStep;
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
  activeStep: activeStep;
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

export interface StepsRender extends ChangeField {
  footerRender?: ({
    stepsLength,
    activeStep,
    footerSteps,
  }: {
    stepsLength: number;
    activeStep: activeStep;
    footerSteps: Partial<InitialStateSteps['footerSteps']>;
  }) => Record<'next' | 'back', Message & { state?: boolean }>;
  handleNextStep: (activeStep: activeStep) => void;
  handleBackStep: (activeStep: activeStep) => void;
  gridProps?: Omit<GridProps, 'children'>;
  stepperProps?: Omit<StepperProps, 'activeStep' | 'children'>;
  getSteps?: () => StepProps[];
  stepsBuild: InitialStateSteps;
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
  activeStep?: activeStep;
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
type ReturnValidationError = undefined | void | ValidationError;
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

export interface ExtraProps extends ActionsFiles {
  helpMessage?: boolean;
  searchField?:
    | string
    | number
    | ((e: PropsField[]) => string | number);
  searchId?: string;
  search?: { state: boolean; value: string | number };
  renderItem?: React.ReactNode;
  timeConsult?: number;
  actions?: {
    onDelete(e: any): any;
    onAdd(e: any): any;
  };
  loading?: boolean;
  accept?: string | string[];
  extensions?: string[];
  multiple?: boolean;
  validateExtensions?: boolean;
  validateAccept?: boolean;
  subLabel?: Message;
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
  fieldProxy?: FieldBuilder<V>;
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

export type TypeField = 'component' | 'file' | TypeTextField;

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
  | 'rowsMax'
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

export enum StatusField {
  // This control has passed all validation checks.
  'VALID' = 'VALID',
  // This control has failed at least one validation check.
  'INVALID' = 'INVALID',
  // This control is in the midst of conducting a validation check.
  'PENDING' = 'PENDING',
  // This control is exempt from validation checks.
  'DISABLED' = 'DISABLED',
}

export interface PropsFieldBase<V = value> {
  type?: TypeField;
  name: string;
  value: V;
  disabled?: boolean;
  defaultInputValue?: V;
  label?: LabelPropsField;
  onChange?: changeField<V>;
}

export interface PropsField<V = value>
  extends PropsFieldBase<V>,
    ValidationsField<V>,
    InitialState,
    GridRender {
  extraProps?: ExtraProps;
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
  fieldProxy: FieldBuilder<V>;
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
  activeStep?: activeStep;
  getFields?: () => PropsField[];
}

export type FieldRenderProps<V = value> = BaseBuilder<V> &
  BaseRender<V>;

export type FieldsRenderProps = FieldsProps & BaseBuilder;

export type FieldRenderComponentProps<V = value> = FieldRenderProps<
  V
>;
