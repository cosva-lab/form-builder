import { JSXElementConstructor } from 'react';
import { GridSize, GridProps } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import { StepperProps } from '@material-ui/core/Stepper';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { TextFieldProps } from '@material-ui/core/TextField';

import { ActionsFiles } from './inputsTypes/FileInput/Props';
import StepValidator from './utils/validate/stepValidator';
import FieldsBuilder from './utils/builders/FieldsBuilder';
import FieldBuilder from './utils/builders/FieldBuilder';
import validators from './utils/validate/validators';
import { StepsBuilder } from './utils';

export interface Message {
  ns?: string;
  message: string;
  state?: boolean;
  props?: any;
}

export interface EventField<V = value> {
  target: { name: string; value: V; type?: string };
  waitTime?: boolean;
  changeStateComponent?: boolean;
}

export type changeField<V = value> = (
  e: EventField<V>,
  callback?: () => void,
) => void;

export interface ChangeField<V = value> {
  changeField: changeField<V>;
}

export type value = any;
export type extra =
  | { [key: string]: any }
  | (() => { [key: string]: any });
export type transPosition = string | boolean;
export type activeStep = number;

export interface InitialState {
  ns?: string;
  isNew?: boolean;
  validate?: boolean;
  extra?: extra;
}

export interface InitialStateSteps extends InitialState {
  steps: Step[];
  activeStep: activeStep;
  loading?: boolean;
  footerSteps?: { [key: number]: Record<'next' | 'back', Message> };
}

export declare function buildFields(a: PropsField[]): PropsField[];

export type FieldsAll = PropsField[];

export interface InitialStateFields extends InitialState {
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

export interface FormStepsProps extends InitialState {
  handleNextStep({ activeStep }: { activeStep: activeStep }): void;
  handleBackStep({ activeStep }: { activeStep: activeStep }): void;
}

export interface FieldsRenderProps extends InitialState {
  fields: (FieldBuilder | PropsField)[];
  actionsExtra?: {};
  validate?: boolean;
  transPosition?: transPosition;
}

export interface Step extends FieldsRenderProps {
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
  getSteps?: () => Step[];
  stepsBuild: InitialStateSteps;
}

type Rules = keyof typeof validators;

export interface Validation {
  rule: Rules;
  message: string;
  state?: boolean;
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
) => ErrorField | Promise<ErrorField> | void;

export interface Validations<V = value> {
  validate?: boolean;
  value: V;
  validations?: (Validation | ValidationFunction<V>)[];
  changed?: boolean;
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
  onKeyDown?(event: any): void;
  loading?: boolean;
  options?: any[];
  NoOptionsMessage?: React.ReactNode;
  inputValue?: string;
  filterOption?: (
    option: { label: string; value: string; data: any },
    rawInput: string,
  ) => boolean;
  filterOptions?: (options: any[]) => any[];
  accept?: string | string[];
  extensions?: string[];
  multiple?: boolean;
  validateExtensions?: boolean;
  validateAccept?: boolean;
  subLabel?: Message;
}

export type ChildrenRender = React.ReactElement<
  FormInputProps,
  JSXElementConstructor<FormInputProps>
>;

export type RenderField = (element: {
  children: ChildrenRender;
  props: FieldRenderProps;
}) => React.CElement<any, any>;

export type ComponentField = React.ElementType<FieldRenderProps>

export type TypeField =
  | 'autoComplete'
  | 'checkbox'
  | 'chips'
  | 'component'
  | 'date'
  | 'email'
  | 'file'
  | 'list'
  | 'listSwitch'
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

export type ErrorField = Message & { errorServer?: boolean };
export type BreakpointsField = Partial<
  Record<Breakpoint, boolean | GridSize>
>;

export interface PropsFieldBase<V = value> {
  type?: TypeField;
  name: string;
  value: V;
  disabled?: boolean;
  defaultInputValue?: V;
  label?: LabelPropsField;
  state?: boolean;
}

export interface PropsField<V = value>
  extends PropsFieldBase<V>,
    Validations<V>,
    InitialState {
  fieldProxy?: FieldBuilder;
  extraProps?: ExtraProps;
  render?: RenderField;
  waitTime?: boolean;
  fullWidth?: boolean;
  transPosition?: transPosition;
  error?: ErrorField;
  serverError?: string[] | string;
  autoComplete?: string;
  inputProps?: InputPropsField;
  textFieldProps?: TextFieldPropsField;
  breakpoints?: BreakpointsField;
  component?: ComponentField;
}

export interface Validate<V = value> extends Validations<V> {
  state?: boolean;
}

export interface FormInputProps extends BaseProps {
  multiple?: boolean;
}

export interface BaseProps<V= value> extends PropsField<V>, ChangeField {}

export interface InputProps extends BaseProps {
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

export interface InputPropsComplete extends BaseProps {
  type: 'autoComplete';
}

export interface InputPropsChips extends BaseProps {
  type: 'chips';
}

export interface InputPropsSwitchList extends BaseProps {
  type: 'listSwitch';
}
export interface FieldRenderProps<V = value>
  extends PropsField<V>,
    BaseBuilder<V> {}

export type FieldRenderComponentProps<V = value> = FieldRenderProps<V>

export interface BaseBuilder<V = value> extends ChangeField<V> {
  getSteps?: () => Step[];
  activeStep?: activeStep;
  getFields?: () => PropsField[];
}
