import { observable } from 'mobx';

import {
  Validation,
  ValidationFunction,
  value,
  Validate,
  ValidationErrors,
  ValidationError,
  PropsFieldBase,
  StatusField,
  GlobalProps,
  ValidationsField,
} from '../../types';
import Field from '../builders/Field';
import { validators } from '../validate';

type PropsInput<V = value> = Validate<V> & PropsFieldBase<V>;
export abstract class InputValidator<V = value> extends Field<V>
  implements Validate<V> {
  public originalProps?: Pick<PropsInput<V>, 'value' | 'validate'>;

  public _validate?: ValidationsField<V>['validate'];
  public get validate() {
    return typeof this._validate === 'function'
      ? this._validate(this)
      : this._validate;
  }

  public set validate(validate: boolean | undefined) {
    this._validate = validate;
    if (validate) this.validity();
    else this.errors = undefined;
  }

  public touched?: boolean;
  public get untouched() {
    return !this.touched;
  }

  @observable public validations?: (
    | Validation
    | ValidationFunction<V>
  )[];

  private _globalProps?: GlobalProps;
  public get globalProps(): GlobalProps | undefined {
    return (
      (this.fieldsBuilder && this.fieldsBuilder.globalProps) ||
      this._globalProps
    );
  }

  public set globalProps(globalProps: GlobalProps | undefined) {
    if (this.fieldsBuilder)
      this.fieldsBuilder.globalProps = globalProps;
    else this._globalProps = globalProps;
  }

  constructor(props: PropsInput<V>) {
    super(props);
    const { validate, validations, value } = props;
    this._validate = validate;
    // validations is an array of validation rules specific to a form
    this.validations = validations;
    this.originalProps = { value, validate };
  }

  protected hasValidationError(validation: Validation): boolean {
    let rule = validation.rule || 'isEmpty';
    const { args = [] } = validation;
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
          typeof this.value === 'string' &&
          validator((this.value || '').toString(), args) === boolean
        ) {
          this.status = StatusField.INVALID;
          return true;
        } else this.status = StatusField.VALID;
      }
    }
    return false;
  }

  public abstract getErrors(params?: {
    validate?: boolean;
  }):
    | Promise<ValidationErrors | undefined>
    | ValidationErrors
    | undefined;
  public async hasErrors() {
    await this.validityBase();
    return this.invalid;
  }

  /**
   * @deprecated Please use `hasErrors`
   */
  public async haveErrors() {
    return this.hasErrors();
  }

  public markAsTouched() {
    this.touched = true;
  }

  public markAsUntouched() {
    this.touched = false;
  }

  private async validityBase() {
    const setError = (errors?: ValidationErrors) => {
      if (errors && errors.length) {
        this.errors = errors;
        this.status = StatusField.INVALID;
      } else {
        this.errors = undefined;
        this.status = StatusField.VALID;
      }
    };
    const errors = await this.getErrors();
    setError(errors);
  }

  public async validity() {
    this._validate = true;
    await this.validityBase();
  }

  private _calculateStatus(): StatusField {
    if (this.disabled) return StatusField.DISABLED;
    if (this.errors) return StatusField.INVALID;
    return StatusField.VALID;
  }

  async updateValueAndValidity() {
    this._setInitialStatus();
    if (this.enabled) {
      await this.validity();
      this.status = this._calculateStatus();
    }
  }

  setValue(value: V) {
    this.value = value;
    this.markAsDirty();
    this.markAsTouched();
    if (
      typeof this.validate !== 'undefined'
        ? this.validate
        : this.dirty
    )
      this.updateValueAndValidity();
  }

  public reset() {
    this.markAsPristine();
    this.markAsUntouched();
    this._setInitialStatus();
    const { originalProps } = this;
    if (originalProps) {
      const { validate, value } = originalProps;
      this._validate = validate;
      this.value = value;
    }
  }

  addError(error: ValidationError) {
    if (error) {
      if (this.status !== StatusField.INVALID)
        this.status = StatusField.INVALID;
      if (!this.errors) this.errors = [];
      this.errors.unshift(error);
    }
  }

  addErrors(errors: ValidationErrors) {
    this.status = StatusField.INVALID;
    const oldErrors = this.errors || [];
    this.errors = [...errors, ...oldErrors];
  }

  setError(error: ValidationError) {
    this.addError(error);
  }

  setErrors(errors: ValidationErrors) {
    this.addErrors(errors);
  }
}

export default InputValidator;
