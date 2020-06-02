import { observable, action } from 'mobx';

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

  public abstract getErrors():
    | Promise<ValidationErrors | undefined>
    | ValidationErrors
    | undefined;

  public markAsTouched() {
    this.touched = true;
  }

  public markAsUntouched() {
    this.touched = false;
  }

  @action
  private async validityBase() {
    const errors = await this.getErrors();
    if (errors && errors.length) {
      this.errors = errors;
      this.status = StatusField.INVALID;
    } else {
      this.errors = undefined;
      this.status = StatusField.VALID;
    }
  }

  /**
   * @description Returns true if the field is valid
   * @return {Promise<boolean>}
   */
  public async validity() {
    this._validate = true;
    await this.validityBase();
    return this.valid;
  }

  private _calculateStatus(): StatusField {
    if (this.disabled) return StatusField.DISABLED;
    else if (this.errors && this.errors.length)
      return StatusField.INVALID;
    return StatusField.VALID;
  }

  async updateValueAndValidity() {
    this._setInitialStatus();
    if (this.enabled) {
      await this.validity();
      this.status = this._calculateStatus();
    }
  }

  @action
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

  @action
  addError(error: ValidationError) {
    if (error) {
      if (this.status !== StatusField.INVALID)
        this.status = StatusField.INVALID;
      if (!this.errors) this.errors = [];
      this.errors.unshift(error);
    }
  }

  @action
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
