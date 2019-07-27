import { Message } from './../MessagesTranslate/Animation';
import { GridSize } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';

export interface EventField {
  target: { name: string; value: value; type?: string };
  waitTime?: boolean;
}

export declare type changeField = (
  e: EventField,
  callback?: () => void,
) => void;

export interface ChangeField {
  changeField: changeField;
}

export declare type value = any;
export declare type transPosition = string | boolean;
export declare type activeStep = number;

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

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export interface PropsFieldObject extends PropsField {
  name?: string;
}

export declare type Fields = PropsField[];
export interface FieldsObject {
  [key: string]: PropsFieldObject;
}
export declare type FieldsAll = Fields | FieldsObject;

export interface InitialStateFields extends InitialState {
  fields: Fields;
}

export interface ChangeValueFields {
  fields: Fields;
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

export interface FieldsRenderBasic extends InitialState {
  fields: Fields;
  actionsExtra?: {};
  validate?: boolean;
  transPosition?: transPosition;
}

export interface FieldsRenderProps extends FieldsRenderBasic {
  fields: FieldsAll;
}

export interface Step extends FieldsRenderBasic {
  fields: Fields;
  label: string;
}

declare type Rules = Exclude<
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

export interface Validations {
  validate?: boolean;
  validations?: Validation[];
  changed?: boolean;
  validChange?: boolean;
}

export interface ExtraProps {
  helpMessage?: boolean;
  searchField?: string | number | ((e: Fields) => string | number);
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
  multiple?: boolean;
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
declare type render = (element: {
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

interface Component {
  component?:
    | React.ReactElement<FormBuilder.FieldRender>
    | React.ComponentClass<FieldRender>
    | React.Component;
}
export interface PropsField extends Component, Validations {
  fields?: Fields;
  extraProps?: ExtraProps;
  type?:
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
  error?: Message;
  state?: boolean;
  serverError?: string[] | string;
  InputProps?: Partial<OutlinedInputProps>;
  inputProps?: OutlinedInputProps['inputProps'];
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

export declare type Validate = Validations & {
  value: value;
  state?: boolean;
};

export interface FormInputProps extends PropsField, ChangeField {
  multiple?: boolean;
  route: string;
  sendChange?(): void;
  validateField?(): void;
}

export interface BaseProps extends PropsField, ChangeField {
  autoComplete?: string;
}

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
  }
  export interface FieldsRender
    extends FieldsRenderBasic,
      BaseBuilder {}
  export interface FieldRender
    extends FieldRenderProps,
      BaseBuilder {}
}
