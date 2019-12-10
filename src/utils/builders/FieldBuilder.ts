import { observable } from 'mobx';
import {
  ExtraProps,
  LabelPropsField,
  ErrorField,
  InputPropsField,
  TextFieldPropsField,
  extra,
  transPosition,
  PropsField,
  value,
  TypeField,
  RenderField,
  ComponentField,
  BreakpointsField,
  Message,
} from '../../types';
import { InputValidator } from '../validate/InputValidator';
import validators from '../validate/validators';

class FieldBuilder<V = value> extends InputValidator<V>
  implements PropsField {
  @observable public extraProps?: ExtraProps;
  @observable public extra?: extra;
  @observable public type?: TypeField;
  @observable public name: string;
  @observable public value: V;
  @observable public defaultInputValue?: V;
  @observable public label?: LabelPropsField;
  @observable public ns?: string;
  @observable public render?: RenderField;
  @observable public disabled?: boolean;
  @observable public waitTime?: boolean;
  @observable public fullWidth?: boolean;
  @observable public transPosition?: transPosition;
  @observable public error?: ErrorField;
  @observable public serverError?: string[] | string;
  @observable public autoComplete?: string;
  @observable public inputProps?: InputPropsField;
  @observable public textFieldProps?: TextFieldPropsField;
  @observable public breakpoints?: BreakpointsField;
  @observable public component?: ComponentField;

  constructor({
    autoComplete,
    breakpoints,
    component,
    defaultInputValue,
    disabled,
    error,
    extra,
    extraProps,
    fullWidth,
    inputProps,
    label,
    name,
    ns,
    render,
    serverError,
    state = true,
    textFieldProps,
    transPosition,
    type,
    value,
    waitTime,
    // Validations
    changed,
    validChange,
    validate,
    validations,
  }: PropsField<V>) {
    super({
      changed,
      validChange,
      validate,
      validations,
      value,
    });
    Object.assign(this, {
      autoComplete,
      breakpoints,
      component,
      defaultInputValue,
      disabled,
      error,
      extra,
      extraProps,
      fullWidth,
      inputProps,
      label,
      name,
      ns,
      render,
      serverError,
      state,
      textFieldProps,
      transPosition,
      type,
      value,
      waitTime,
    });
  }

  async haveErrors(): Promise<Message> {
    const {
      changed,
      validChange,
      validate,
      validations,
      value,
      state,
      fields,
    } = this;

    let messageResult: Message = {
      state: false,
      message: '',
    };
    if (!validate && !changed && !state) {
      return messageResult;
    }

    if (Array.isArray(validations) && (validChange || validate)) {
      for (const validation of validations) {
        if (typeof validation === 'object') {
          let rule = validation.rule || 'isEmpty';
          const {
            message,
            ns = 'validations',
            props = { attribute: '' },
            args = [],
          } = validation;
          if (
            ![
              'contains',
              'equals',
              'isAfter',
              'isAlpha',
              'isAlphanumeric',
              'isAscii',
              'isDecimal',
              'isEmail',
              'isEmpty',
              'isFloat',
              'isNumeric',
            ].includes(rule)
          ) {
            console.error(rule, `the rule don't exists`);
            rule = 'isEmpty';
          } else {
            const validator = validators[rule];
            if (validator && validator[rule]) {
              const validationMethod: any = validator[rule];
              let bolean = false;
              switch (rule) {
                case 'isEmpty':
                  bolean = true;
                  break;
                default:
                  break;
              }
              try {
                if (
                  typeof value === 'string' &&
                  validationMethod((value || '').toString(), args) ===
                    bolean
                ) {
                  messageResult = {
                    state: true,
                    message,
                    ns,
                    props,
                  };
                  break;
                }
              } catch (error) {
                break;
              }
            }
          }
        } else {
          const temPError = (await validation({
            changed,
            field: this,
            fields,
            steps: this.steps,
            validChange,
            validate,
            value,
          })) || {
            state: false,
            message: '',
          };
          if (temPError.state) {
            messageResult = temPError;
            break;
          }
        }
      }
    }
    return messageResult;
  }
}

export default FieldBuilder;
