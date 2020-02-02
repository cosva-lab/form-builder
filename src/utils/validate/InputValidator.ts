import { observable } from 'mobx';

import {
  Validation,
  ValidationFunction,
  value,
  Validate,
  ValidationErrors,
  PropsFieldBase,
  StatusField,
  GlobalProps,
} from '../../types';
import Field from '../builders/Field';
import { validators } from '../validate';

type PropsInput<V = value> = Validate<V> & PropsFieldBase<V>;
export class InputValidator<V = value> extends Field<V>
  implements Validate<V> {
  public originalFieldBuilder: Pick<
    PropsInput<V>,
    'value' | 'validate'
  >;

  public _validate?: boolean;
  public get validate() {
    return this._validate;
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

  constructor(props: PropsInput<V>) {
    super(props);
    const { validate, validations } = props;
    this.validate = validate;
    // validations is an array of validation rules specific to a form
    this.validations = validations;
    this.getErrors = this.getErrors.bind(this);
  }

  private hasValidationError(validation: Validation): boolean {
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

  public async getErrors(params?: {
    validate?: boolean;
  }): Promise<ValidationErrors | undefined> {
    const { validate = this.validate } = { ...params };
    const { validations, value } = this;
    let messageResult: ValidationErrors = [];
    if (!validate && !this.dirty && !this.enabled)
      return messageResult;

    if (Array.isArray(validations) && validate) {
      for (const validation of validations) {
        if (typeof validation === 'object') {
          const res = this.hasValidationError(validation);
          if (res) {
            messageResult = [
              ...messageResult,
              { [validation.rule]: validation },
            ];
          }
        } else {
          const res = await validation({
            field: this,
            fieldsBuilder: this.fieldsBuilder,
            stepsBuilder: this.stepsBuilder,
            validate,
            value,
          });

          const errors: ValidationErrors = [];
          if (typeof res === 'string') {
            errors.push(res);
          } else if (res) {
            errors.push(...res);
          }
          if (res) messageResult = [...messageResult, ...errors];
        }
      }
    }
    return messageResult.length ? messageResult : undefined;
  }

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
    if (this.validate) this.updateValueAndValidity();
  }

  public reset() {
    this.markAsPristine();
    this.markAsUntouched();
    const {
      originalFieldBuilder: { validate, value },
    } = this;
    this._validate = validate;
    this.value = value;
  }
}

export default InputValidator;
