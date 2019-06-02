import { Message } from './../MessagesTranslate/Animation';
import { GridSize } from '@material-ui/core/Grid';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
export declare type EventField = {
  target: { name: string; value: value; type?: string };
};

export declare type handleChange = (e: EventField) => void;

export declare type value = any;
export declare type transPosition = string | boolean;

export interface InitialState {
  id: number;
  ns: string;
  isNew: boolean;
  activeStep: number;
  validationState: boolean;
  validate: boolean;
  steps: Step[];
}

export interface FieldsRenderProps {
  handleChange: handleChange;
  actionsExtra: {};
  state?: boolean;
  validate?: boolean;
  ns?: string;
  transPosition: stransPosition;
  fields: PropsField[];
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
  state: boolean;
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
  e: EventField & { waitTime: boolean },
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
  label: Message & {
    notPos: boolean;
    transPosition?: transPosition;
  };
  value: value;
  ns: string;
  disabled?: boolean;
  waitTime?: boolean;
  transPosition?: transPosition;
  handleChange: handleChange;
  component?: React.ReactElement | React.FunctionComponent;
  validChange: boolean;
  validation: Validation[];
  changed?: boolean;
  error?: Message;
  state?: boolean;
  serverError: string[] | string;
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
  label: React.ReactNode;
  multiple?: boolean;
  component: React.ReactNode;
  route: PropTypes.string;
  fullWidth: boolean;
  searchId: string;
  handleChange: handleChangeFieldRender;
  validateField(): void;
}

export interface InputProps extends PropsField {
  type: 'text' | 'number' | 'email' | 'date' | 'password';
  autoComplete: string;
  waitTime: boolean;
  fullWidth: boolean;
  handleChange: handleChangeFieldRender;
}
