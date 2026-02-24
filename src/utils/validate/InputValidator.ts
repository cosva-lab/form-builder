import {
  observable,
  action,
  makeObservable,
  runInAction,
} from 'mobx';

import type {
  Validate,
  ValidationError,
  ValidateField,
  PropsField,
  FieldType,
  GetErrors,
} from '../../types';
import { StatusField } from '../../enums';
import BaseField from '../builders/BaseField';

type PropsInput<Type extends FieldType> = Validate<Type> &
  PropsField<Type>;

export abstract class InputValidator<
  Type extends FieldType<any, any, any>,
> extends BaseField<Type> {
  public originalProps?: Pick<PropsInput<Type>, 'value' | 'validate'>;

  static getValidation<Field extends FieldType>(
    obj: InputValidator<Field>,
  ) {
    return typeof obj._validate === 'function'
      ? obj._validate(obj)
      : obj._validate;
  }

  public _validate?: ValidateField<Type> = false;
  public get validate() {
    return !!InputValidator.getValidation(this);
  }

  public set validate(validate: ValidateField<Type> | undefined) {
    this._validate = validate;
    if (validate) this.validity();
    else this.errors = undefined;
  }

  public touched?: boolean;
  public get untouched() {
    return !this.touched;
  }

  @observable public validations: Type['validations'];

  constructor(props: PropsInput<Type>) {
    super(props);
    makeObservable(this);
    const { validate, validations, value } = props;
    if (typeof validate !== 'undefined') this._validate = validate;
    // validations is an array of validation rules specific to a form
    this.validations = validations;
    this.originalProps = {
      value,
      validate: validate as PropsInput<Type>['validate'],
    };
  }

  public abstract getErrors():
    | Promise<GetErrors<Type['validations']> | undefined>
    | GetErrors<Type['validations']>
    | undefined;

  public markAsTouched = () => {
    this.touched = true;
  };

  public markAsUntouched = () => {
    this.touched = false;
  };

  @action.bound
  private async validityBase() {
    const errors = await this.getErrors();
    runInAction(() => {
      if (errors && errors.length) {
        this.errors = errors;
        this.status = StatusField.INVALID;
      } else {
        this.errors = [];
        this.status = StatusField.VALID;
      }
    });
    return this.valid;
  }

  /**
   * @description Returns true if the field is valid
   * @return {Promise<boolean>}
   */
  @action.bound
  public async validity() {
    this._validate = true;
    return this.validityBase();
  }

  private _calculateStatus(): StatusField {
    if (this.errors?.length) return StatusField.INVALID;
    return StatusField.VALID;
  }

  @action.bound
  async updateValueAndValidity() {
    this._setInitialStatus();
    if (this.enabled) {
      await this.validity();
      runInAction(() => {
        this.status = this._calculateStatus();
      });
    }
  }

  @action.bound
  public reset() {
    this.markAsPristine();
    this.markAsUntouched();
    this._setInitialStatus();
    const { originalProps } = this;
    this.errors = undefined;
    if (originalProps) {
      const { validate, value } = originalProps;
      this._validate = validate;
      this.value = value;
    }
  }

  @action.bound
  addError(error: ValidationError) {
    if (error) {
      if (this.status !== StatusField.INVALID)
        this.status = StatusField.INVALID;
      if (!this.errors) this.errors = [];
      this.errors.unshift(error as never);
    }
  }

  @action.bound
  addErrors(errors: ValidationError[]) {
    this.status = StatusField.INVALID;
    const oldErrors = this.errors || [];
    if (Array.isArray(oldErrors)) {
      this.errors = [
        ...(errors || []),
        ...oldErrors,
      ] as unknown as GetErrors<Type['validations']>;
    }
  }

  setError = (error: ValidationError) => {
    this.addError(error);
  };

  setErrors = (errors: ValidationError[]) => {
    this.addErrors(errors);
  };
}

export default InputValidator;
