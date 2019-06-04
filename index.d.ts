import { Message } from './../MessagesTranslate/Animation';
import { GridSize } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';

export declare type EventField = {
  target: { name: string; value: value; type?: string };
};

export declare type handleChange = (e: EventField) => void;

export declare type value = any;
export declare type transPosition = string | boolean;
export declare type activeStep = number;

export interface InitialState {
  id: number;
  ns: string;
  isNew: boolean;
  activeStep: activeStep;
  validationState: boolean;
  validate: boolean;
  steps: Step[];
}

export interface FormStepsProps extends InitialState {
  handleNextStep({ activeStep }: { activeStep: activeStep }): void;
  handleBackStep({ activeStep }: { activeStep: activeStep }): void;
}

export interface FieldsRenderProps {
  fields: PropsField[];
  actionsExtra?: {};
  state?: boolean;
  validate?: boolean;
  ns?: string;
  transPosition?: transPosition;
}

export interface Step extends FieldsRenderProps {
  label: string;
}

declare type Rules =
  | 'contains'
  | 'equals'
  | 'isAfter'
  | 'isAlpha'
  | 'isAlphanumeric'
  | 'isAscii'
  | 'isBase64'
  | 'isBefore'
  | 'isBoolean'
  | 'isByteLength'
  | 'isByteLength'
  | 'isCreditCard'
  | 'isCurrency'
  | 'isDataURI'
  | 'isDecimal'
  | 'isDivisibleBy'
  | 'isEmail'
  | 'isEmpty'
  | 'isFQDN'
  | 'isFloat'
  | 'isFullWidth'
  | 'isHalfWidth'
  | 'isHash'
  | 'isHexColor'
  | 'isHexadecimal'
  | 'isIP'
  | 'isISBN'
  | 'isISSN'
  | 'isISIN'
  | 'isISO8601'
  | 'isISO31661Alpha2'
  | 'isISRC'
  | 'isIn'
  | 'isInt'
  | 'isJSON'
  | 'isJWT'
  | 'isLatLong'
  | 'isLength'
  | 'isLength'
  | 'isLowercase'
  | 'isMACAddress'
  | 'isMD5'
  | 'isMimeType'
  | 'isMobilePhone'
  | 'isMongoId'
  | 'isMultibyte'
  | 'isNumeric'
  | 'isPort'
  | 'isPostalCode'
  | 'isSurrogatePair'
  | 'isURL'
  | 'isUUID'
  | 'isUppercase'
  | 'isVariableWidth'
  | 'isWhitelisted'
  | 'matches'
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
  | 'toString';

export interface Validation {
  rule: Rules;
  state?: boolean;
  message: string;
  ns?: string;
  props?: {};
  args?: any;
}

export interface Validations {
  validate?: boolean;
  validation?: Validation[];
  changed?: boolean;
  validChange?: boolean;
}

export declare type handleChangeFieldRender = (
  e: EventField & { waitTime?: boolean },
) => void;

export declare type extraProps = {
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
  multiple?: boolean;
  loading?: boolean;
  options?: any;
  NoOptionsMessage?: React.ReactNode;
  filterOption?(
    option: { label: string; value: string; data: any },
    rawInput: string,
  ): boolean;

  accept?: string | string[];
  extensions?: string[];
  multiple?: boolean;
  validateExtensions?: boolean;
  validateAccept?: boolean;
  subLabel?: Message;
};

export interface PropsField {
  name: string;
  type:
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
  value: value;
  defaultInputValue?: value;
  validChange?: boolean;
  validation?: Validation[];
  label?:
    | Message & {
        notPos: boolean;
        transPosition?: transPosition;
      }
    | string;
  ns?: string;
  disabled?: boolean;
  waitTime?: boolean;
  fullWidth?: boolean;
  transPosition?: transPosition;
  component?: React.ReactNode;
  changed?: boolean;
  error?: Message;
  state?: boolean;
  serverError?: string[] | string;
  extraProps?: extraProps;
  InputProps?: Partial<OutlinedInputProps>;
  inputProps?: OutlinedInputProps['inputProps'];
}

export interface FieldRenderProps extends Validations, PropsField {
  actionsExtra?: {};
  search?: {
    state: boolean;
    value: number;
  };
  render?(e: React.ReactNode): React.ReactNode;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xs?: GridSize;
  waitTime?: boolean;
}

export declare type Validate = Validations & {
  value: value;
  state?: boolean;
};

export interface FormInputProps extends PropsField {
  multiple?: boolean;
  route: string;
  handleChange: handleChangeFieldRender;
  validateField(): void;
}

export interface BaseProps extends PropsField {
  autoComplete?: string;
  waitTime?: boolean;
  handleChange: handleChangeFieldRender;
}

export interface InputProps extends BaseProps {
  type: 'text' | 'number' | 'email' | 'date' | 'password';
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
  interface BaseBuilder {
    handleChange: handleChange;
  }
  export interface FieldsRender
    extends FieldsRenderProps,
      BaseBuilder {}
  export interface FieldRender
    extends FieldRenderProps,
      BaseBuilder {}
}
