import { Message } from './../MessagesTranslate/Animation';
import { GridSize } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';

export interface EventField {
  target: { name: string; value: value; type?: string };
  waitTime?: boolean;
}

export type changeField = (
  e: EventField,
  callback?: () => void,
) => void;

export interface ChangeField {
  changeField: changeField;
}

export type value = any;
export type transPosition = string | boolean;
export type activeStep = number;

export interface InitialState {
  id?: number;
  ns?: string;
  isNew?: boolean;
  validationState?: boolean;
  validate?: boolean;
}
export interface InitialStateSteps extends InitialState {
  steps: Step[];
  activeStep: activeStep;
}

export interface PropsFieldObject extends PropsField {
  name?: string;
}

export interface FieldsObject {
  [key: string]: PropsFieldObject;
}

export function buildFields(a: PropsField[]): PropsField[];

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
  steps: Step[];
  action: ChangeValueFields['action'];
}

export interface FormStepsProps extends InitialState {
  handleNextStep({ activeStep }: { activeStep: activeStep }): void;
  handleBackStep({ activeStep }: { activeStep: activeStep }): void;
}

export interface FieldsRender extends InitialState {
  fields: PropsField[];
  actionsExtra?: {};
  validate?: boolean;
  transPosition?: transPosition;
}

export interface Step extends FieldsRender {
  label: string;
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

interface AllPropsValidationFunction extends Partial<Validate> {
  fields?: PropsField[];
  steps?: Step[];
  activeStep?: activeStep;
}

export type ValidationFunction = (
  all: AllPropsValidationFunction,
) => Message | void;

export interface Validations {
  validate?: boolean;
  validations?: (Validation | ValidationFunction)[];
  changed?: boolean;
  validChange?: boolean;
}

export interface ExtraProps {
  helpMessage?: boolean;
  searchField?:
    | string
    | number
    | ((e: PropsField[]) => string | number);
  searchId?: string;
  search?: { state: boolean; value: string | number };
  renderItem?: React.ReactNode;
  id?: string | number;
  timeConsult?: number;
  actions?: {
    onDelete(e: any);
    onAdd(e: any);
  };
  onKeyDown?(event: KeyboardEvent<Element>): void;
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
type render = (element: {
  children: React.ReactElement<any>;
  props: FieldRenderProps;
}) => React.CElement;

interface BasicFields {
  type?: 'text' | 'number' | 'email' | 'password' | 'time' | 'date';
}
interface FileField {
  type: 'file';
  extraProps?: ExtraProps;
}
interface ListSwitchField {
  type: 'listSwitch';
  extraProps?: ExtraProps;
}
interface ListField {
  type: 'list';
  extraProps?: ExtraProps;
}
interface AutoCompleteField {
  type: 'autoComplete';
  extraProps?: ExtraProps;
}
interface TableField {
  type: 'table';
  extraProps?: ExtraProps;
}
interface ChipsField {
  type: 'chips';
  extraProps?: ExtraProps;
}
interface CheckboxField {
  type: 'checkbox';
}

interface ComponentField {
  component?:
    | React.ReactElement<FormBuilder.FieldRender>
    | React.ComponentClass<FormBuilder.FieldRender>;
}

type typeForm =
  | 'time'
  | 'text'
  | 'file'
  | 'number'
  | 'email'
  | 'date'
  | 'password'
  | 'list'
  | 'table'
  | 'autoComplete'
  | 'chips'
  | 'checkbox'
  | 'component'
  | 'listSwitch';

export interface PropsField extends Validations, ComponentField {
  fields?: PropsField[];
  extraProps?: ExtraProps;
  type?: typeForm;
  name: string;
  value: value;
  defaultInputValue?: value;
  label?:
    | string
    | Message & {
        notPos?: boolean;
        transPosition?: transPosition;
      };
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
  InputProps?: (a: {
    type: InputProps['type'];
    changeType: (
      type: InputProps['type'],
      callback?: () => void,
    ) => void;
  }) => Partial<OutlinedInputProps>;
}

export interface FieldRenderProps
  extends Validations,
    PropsField,
    InitialState {
  actionsExtra?: {};
  search?: {
    state: boolean;
    value: number;
  };
  render?: render;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xs?: GridSize;
}

export interface Validate extends Validations {
  value: value;
  state?: boolean;
}

export interface FormInputProps extends BaseProps {
  multiple?: boolean;
  route: string;
  sendChange?(): void;
  validateField?(): void;
}

export interface BaseProps extends PropsField, ChangeField {}

export interface InputProps extends BaseProps {
  type: 'text' | 'number' | 'email' | 'date' | 'password';
  sendChange?(): void;
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

export namespace FormBuilder {
  interface BaseBuilder extends ChangeField {
    steps?: Step[];
    activeStep?: activeStep;
    getFields?: () => PropsField[];
  }
  export interface Fields extends FieldsRender, BaseBuilder {}
  export interface FieldRender
    extends FieldRenderProps,
      BaseBuilder {}
}
