import { observable } from 'mobx';
import { createViewModel } from 'mobx-utils';
import {
  Validation,
  ValidationFunction,
  value,
  Validate,
  ErrorField,
  Message,
  PropsFieldBase,
} from '../../types';
import Field from '../builders/Field';
import validators from './validators';

export class InputValidator<V = value> extends Field<V>
  implements Validate<V> {
  public get valid(): boolean {
    return (
      !this.error ||
      (typeof this.error.state === 'undefined'
        ? !!this.error.message
        : !this.error.state)
    );
  }
  public get inValid() {
    return !this.valid;
  }
  @observable public _validate?: boolean;
  public get validate() {
    return this._validate;
  }

  public set validate(validate: boolean | undefined) {
    this._validate = validate;
    if (validate) this.validity();
    else this.error = undefined;
  }

  @observable public _value: V;
  public get value() {
    return this._value;
  }

  public set value(value: V) {
    this._value = value;
    if (this.error) {
      if (this.error.state) this.error.state = false;
      if (this.error.message) this.error.message = '';
    } else {
      this.error = { state: false, message: '' };
    }
    if (!this.changed) this.changed = true;
    if (this.validations)
      this.getErrors().then(error => (this.error = error));
  }

  @observable public validations?: (
    | Validation
    | ValidationFunction<V>
  )[];
  @observable public changed?: boolean;
  @observable public validChange?: boolean;
  @observable public error?: ErrorField;
  @observable public serverError?: string[] | string;

  constructor(props: Validate<V> & PropsFieldBase) {
    super(props);
    const {
      changed,
      validChange,
      validate,
      validations,
      value,
    } = props;
    this.changed = changed;
    this.validChange = validChange;
    this.validate = validate;
    // validations is an array of validation rules specific to a form
    this.validations = validations;
    this.value = value;
  }

  async getErrors(): Promise<Message> {
    const {
      changed,
      validChange,
      validate,
      validations,
      value,
      state,
      fieldsBuilder,
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
            if (validator) {
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
                  validator((value || '').toString(), args) === bolean
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
            fieldsBuilder,
            stepsBuilder: this.stepsBuilder,
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

  async hasErrors(params?: { setErrors: boolean }) {
    const { setErrors = false } = { ...params };
    await this.validityBase(setErrors);
    return this.inValid;
  }

  /**
   * @deprecated Please use `hasErrors`
   */
  async haveErrors() {
    return this.hasErrors();
  }

  private setE(field: InputValidator) {
    if (!field.validate) field.validate = true;
    if (!field.changed) field.changed = true;
  }

  private async validityBase(setErrors: boolean = true) {
    this.error = undefined;
    const viewField = createViewModel(this);
    this.setE(viewField);
    const validationsObj: Validation[] = [];
    const setError = (error: Message) => {
      viewField.error = observable(error);
      if (setErrors && !viewField.error.errorServer) {
        viewField.submit();
      }
    };

    if (viewField.validations) {
      const { validations, stepsBuilder, fieldsBuilder } = viewField;
      for (const validation of validations) {
        if (typeof validation === 'object') {
          validationsObj.push(validation);
        } else {
          setError(
            (await validation({
              stepsBuilder,
              fieldsBuilder,
              field: viewField,
            })) || {
              state: false,
              message: '',
            },
          );
        }
      }
    }

    const message = await viewField.getErrors();
    setError(message);
  }

  async validity() {
    await this.validityBase();
  }
}

export default InputValidator;
