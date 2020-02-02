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
import validators from './utils/validate/validators';

export interface Message {
  ns?: string;
  message: string;
  state?: boolean;
  props?: any;
}

export interface EventField<V = value> {
  target: { name: string; value: V; type?: string };
}

export type changeField<V = value> = (
  e: EventField<V>,
  callback?: () => void,
) => void;

export interface ChangeField<V = value> {
  changeField: changeField<V>;
}

export type value = any;
export type GlobalProps = () => { [key: string]: any };
export type transPosition = string | boolean;
export type activeStep = number;

export interface InitialState {
  ns?: string;
  validate?: boolean;
}

interface GlobalPropsInterface {
  globalProps?: GlobalProps;
}

export interface InitialStateSteps
  extends InitialState,
    GlobalPropsInterface {
  steps: StepProps[];
  activeStep: activeStep;
  loading?: boolean;
  footerSteps?: { [key: number]: Record<'next' | 'back', Message> };
}

export declare function buildFields(a: PropsField[]): PropsField[];

export type FieldsAll = PropsField[];

export interface InitialStateFields
  extends InitialState,
    GlobalPropsInterface {
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

export interface FieldsProps
  extends InitialState,
    GlobalPropsInterface {
  fields: (PropsField | FieldBuilder)[];
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
  }) => Record<'next' | 'back', Message>;
  handleNextStep: (activeStep: activeStep) => void;
  handleBackStep: (activeStep: activeStep) => void;
  gridProps?: Omit<GridProps, 'children'>;
  stepperProps?: Omit<StepperProps, 'activeStep' | 'children'>;
  getSteps?: () => StepProps[];
  stepsBuild: InitialStateSteps;
}

type Rules = keyof typeof validators;

export interface Validation {
  rule: Rules;
  message: string;
  ns?: string;
  props?: {};
  args?: any;
}

export interface AllPropsValidationFunction<V = value>
  extends Partial<Validate<V>> {
  fieldsBuilder?: FieldsBuilder;
  field: FieldBuilder;
  stepsBuilder?: StepsBuilder;
  activeStep?: activeStep;
}

export type ValidationFunction<V = value> = (
  all: AllPropsValidationFunction<V>,
) =>
  | undefined
  | void
  | ValidationErrors
  | Promise<ValidationErrors | undefined | void>;

export interface Validations<V = value> {
  validate?: boolean;
  value: V;
  validations?: (Validation | ValidationFunction<V>)[];
  validChange?: boolean;
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

export interface ComponentErrorsProps {
  errors: ValidationErrors;
}

export type ComponentErrors = React.ElementType<ComponentErrorsProps>;

export type TypeField =
  | 'component'
  | 'date'
  | 'email'
  | 'file'
  | 'number'
  | 'password'
  | 'search'
  | 'table'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

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
  | (Message & {
      notPos?: boolean;
      transPosition?: transPosition;
    });

export type InputPropsField = (a: {
  type: InputProps['type'];
  changeType: (
    type: InputProps['type'],
    callback?: () => void,
  ) => void;
}) => Partial<OutlinedInputProps>;

/**
 * @description
 * Defines the map of errors returned from failed validation checks.
 *
 * @publicApi
 */
export type ValidationErrors =
  | string
  | (Record<string, string | Validation> | string)[];

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
}

export interface PropsField<V = value>
  extends PropsFieldBase<V>,
    Validations<V>,
    InitialState {
  extraProps?: ExtraProps;
  render?: RenderField;
  waitTime?: boolean;
  fullWidth?: boolean;
  transPosition?: transPosition;
  errors?: ValidationErrors;
  serverError?: string[] | string;
  autoComplete?: string;
  inputProps?: InputPropsField;
  textFieldProps?: TextFieldPropsField;
  breakpoints?: BreakpointsField;
  component?: ComponentField;
  renderErrors?: ComponentErrors;
}

export interface Validate<V = value> extends Validations<V> {
  state?: boolean;
}

export interface BaseRender<V = value> {
  fieldProxy: FieldBuilder<V>;
}

export interface FieldProps<V = value>
  extends BaseRender<V>,
    ChangeField {}

export interface InputProps extends FieldProps {
  type?:
    | 'date'
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
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
