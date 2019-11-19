import { JSXElementConstructor } from 'react';
import { GridSize, GridProps } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import { StepperProps } from '@material-ui/core/Stepper';
import { ActionsFiles } from './inputsTypes/FileInput/Props';
import StepValidator from './utils/validate/stepValidator';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { TOptions } from 'i18next';
import { TextFieldProps } from '@material-ui/core/TextField';

export interface Message {
  ns?: string;
  message: string;
  state?: boolean;
  props?: TOptions;
}

export interface EventField {
  target: { name: string; value: value; type?: string };
  waitTime?: boolean;
  changeStateComponent?: boolean;
}

export type changeField = (
  e: EventField,
  callback?: () => void,
) => void;

export interface ChangeField {
  changeField: changeField;
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
  validationState?: boolean;
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

export interface ChangeValueFields {
  fields: PropsField[];
  action: { value: any; name: string };
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
  fields: PropsField[];
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

type Rules = Exclude<
  keyof ValidatorJS.ValidatorStatic,
  | 'version'
  | 'blacklist'
  | 'escape'
  | 'unescape'
  | 'ltrim'
  | 'normalizeEmail'
  | 'rtrim'
  | 'stripLow'
  | 'toBoolean'
  | 'toDate'
  | 'toFloat'
  | 'toInt'
  | 'trim'
  | 'whitelist'
  | 'toString'
  | 'version'
  | 'extend'
>;

export interface Validation {
  rule: Rules;
  message: string;
  state?: boolean;
  ns?: string;
  props?: {};
  args?: any;
}

export interface AllPropsValidationFunction
  extends Partial<Validate> {
  fields?: PropsField[];
  steps?: Step[];
  activeStep?: activeStep;
}

export type ValidationFunction = (
  all: AllPropsValidationFunction,
) => Message | void;

export interface Validations {
  validate?: boolean;
  value: any;
  validations?: (Validation | ValidationFunction)[];
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
type render = (element: {
  children: ChildrenRender;
  props: FieldRenderComponetsProps;
}) => React.CElement<any, any>;

interface ComponentField {
  component?:
    | React.ReactElement<FieldRenderComponetsProps>
    | React.ComponentClass<FieldRenderComponetsProps>
    | React.Component<FieldRenderComponetsProps>;
}

type typeForm =
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

export interface PropsField<V = value>
  extends Validations,
    ComponentField,
    Partial<Record<Breakpoint, boolean | GridSize>> {
  fields?: PropsField[];
  fieldProxy?: PropsField;
  extraProps?: ExtraProps;
  extra?: extra;
  type?: typeForm;
  name: string;
  value: V;
  defaultInputValue?: V;
  label?:
    | string
    | (Message & {
        notPos?: boolean;
        transPosition?: transPosition;
      });
  ns?: string;
  render?: render;
  disabled?: boolean;
  waitTime?: boolean;
  fullWidth?: boolean;
  transPosition?: transPosition;
  error?: Message & { errorServer?: boolean };
  state?: boolean;
  serverError?: string[] | string;
  autoComplete?: string;
  inputProps?: (a: {
    type: InputProps['type'];
    changeType: (
      type: InputProps['type'],
      callback?: () => void,
    ) => void;
  }) => Partial<OutlinedInputProps>;
  textFieldProps?: Pick<
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
  actionsExtPropsra?: {};
  search?: {
    state: boolean;
    value: number;
  };
}

export interface FieldRenderProps
  extends Validations,
    PropsField,
    InitialState {}

export interface Validate extends Validations {
  value: value;
  state?: boolean;
}

export interface FormInputProps extends BaseProps {
  multiple?: boolean;
  route: string;
}

export interface BaseProps extends PropsField, ChangeField {}

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
export interface FieldRenderComponetsProps
  extends FieldRenderProps,
    BaseBuilder {}

export interface BaseBuilder extends ChangeField {
  getSteps?: () => Step[];
  activeStep?: activeStep;
  getFields?: () => PropsField[];
}
