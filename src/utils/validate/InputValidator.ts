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
import { StatusField, GlobalProps } from '../../types';

export class InputValidator<V = value> extends Field<V>
  implements Validate<V> {
  @observable public _validate?: boolean;
  public get validate() {
    return this._validate;
  }

  public set validate(validate: boolean | undefined) {
    this._validate = validate;
    if (validate) this.validity();
    else this.error = undefined;
  }

  @observable public touched?: boolean;
  public get untouched() {
    return !this.touched;
  }

  @observable public validations?: (
    | Validation
    | ValidationFunction<V>
  )[];
  @observable public changed?: boolean;
  @observable public validChange?: boolean;
  @observable public error?: ErrorField;

  @observable public serverError?: string[] | string;

  @observable private _globalProps?: GlobalProps;
  public get globalProps(): GlobalProps | undefined {
    return (
      (this.fieldsBuilder && this.fieldsBuilder.globalProps) ||
      this._globalProps
    );
  }

  public set globalProps(globalProps: GlobalProps | undefined) {
    if (this.fieldsBuilder && this.fieldsBuilder.globalProps) {
      this.fieldsBuilder.globalProps = globalProps;
    } else this._globalProps = globalProps;
  }

  constructor(props: Validate<V> & PropsFieldBase) {
    super(props);
    const { changed, validChange, validate, validations } = props;
    this.changed = changed;
    this.validChange = validChange;
    this.validate = validate;
    // validations is an array of validation rules specific to a form
    this.validations = validations;
    /* this.getErrors = this.getErrors.bind(this); */
  }

  public getError({
    value,
    validation,
  }: {
    value: V;
    validation: Validation;
  }): Message | undefined {
    if (typeof validation === 'object') {
      let rule = validation.rule || 'isEmpty';
      const {
        message,
        ns = 'validations',
        props = undefined,
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
          let boolean = false;
          switch (rule) {
            case 'isEmpty':
              boolean = true;
              break;
            default:
              break;
          }
          if (
            typeof value === 'string' &&
            validator((value || '').toString(), args) === boolean
          ) {
            this.status = StatusField.INVALID;
            return {
              state: true,
              message,
              ns,
              props,
            };
          } else this.status = StatusField.VALID;
        }
      }
    }
    return;
  }

  public async getErrors(params?: {
    validate?: boolean;
  }): Promise<ErrorField[] | undefined> {
    const { validate = this.validate } = { ...params };
    const {
      changed,
      validChange,
      validations,
      value,
      enabled,
    } = this;
    let errors: ErrorField[] | undefined = undefined;
    this.errors = errors;

    let messageResult: ErrorField | undefined = undefined;
    if (!validate && !changed && !enabled) return messageResult;

    if (Array.isArray(validations) && (validChange || validate)) {
      for (const validation of validations) {
        if (typeof validation === 'object') {
          const res = this.getError({ validation, value });
          if (res) {
            if (!messageResult) messageResult = res;
            if (!errors) errors = [];
            errors.push(res);
            this.status = StatusField.INVALID;
          } else this.status = StatusField.VALID;
        } else {
          const res = await validation({
            changed,
            field: this,
            fieldsBuilder: this.fieldsBuilder,
            stepsBuilder: this.stepsBuilder,
            validChange,
            validate,
            value,
          });
          if (res) {
            if (!messageResult) messageResult = res;
            this.status = StatusField.INVALID;
            if (!errors) errors = [];
            errors.push(res);
          } else this.status = StatusField.VALID;
        }
        this.errors = errors;
      }
    }
    return errors;
  }

  public async hasErrors(params?: { setErrors: boolean }) {
    const { setErrors = false } = { ...params };
    await this.validityBase(setErrors);
    return this.invalid;
  }

  /**
   * @deprecated Please use `hasErrors`
   */
  public async haveErrors(params?: { setErrors: boolean }) {
    return this.hasErrors(params);
  }

  public markAsTouched() {
    this.validity();
    this.touched = true;
  }

  public markAsUntouched() {
    this.touched = false;
  }

  private async validityBase(setErrors: boolean = true) {
    const viewField = createViewModel(this);
    const setError = (error?: Message) => {
      viewField.error = error;
      if (setErrors) viewField.submit();
      else {
      }
    };
    const errors = await this.getErrors();
    setError(errors && errors[0]);
  }

  public async validity() {
    this._validate = true;
    await this.validityBase();
  }

  setValue(value: V) {
    this.value = value;
    this.markAsTouched();
    if (this.error) {
      if (this.error.state) this.error.state = false;
      if (this.error.message) this.error.message = '';
    } else {
      this.error = { state: false, message: '' };
    }
    if (!this.changed) this.changed = true;
  }
}

export default InputValidator;
