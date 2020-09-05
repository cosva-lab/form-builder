import { observable, action } from 'mobx';

import { FieldsProps } from '../..';
import FieldBuilder from '../builders/FieldBuilder';
import {
  ValidationErrors,
  ValidateInputsValidator,
} from '../../types';

class InputsValidator {
  @observable public valid = true;
  public get invalid() {
    return !this.valid;
  }
  @observable public fields: FieldBuilder[];
  @observable public _validate?: ValidateInputsValidator;
  public get validate() {
    return typeof this._validate === 'function'
      ? this._validate(this)
      : this._validate;
  }

  public set validate(validate: boolean | undefined) {
    this._validate = validate;
    if (validate) this.validity();
    for (const field of this.fields)
      if (validate) field._validate = true;
      else field.errors = undefined;
  }

  constructor({
    fields,
    validate,
  }: Pick<FieldsProps, 'fields' | 'validate'>) {
    this._validate = validate;
    this.callbackField = this.callbackField.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.fields = fields.map(field => new FieldBuilder(field));
  }

  async callbackField(
    callback: (field: FieldBuilder, cancel: () => void) => void,
  ) {
    const fields = this.fields;
    for (const field of this.fields) {
      let cancel = false;
      await callback(field, () => {
        cancel = true;
      });
      if (cancel) break;
    }
    return fields;
  }

  @action
  private async validityBase(args?: {
    setErrors?: boolean;
    throwFirstError?: boolean;
  }) {
    this.valid = true;
    const { setErrors = true, throwFirstError = false } = { ...args };
    await this.callbackField(async (field, cancel) => {
      if (field.enabled) {
        const valid = setErrors
          ? await field.validity()
          : await field.hasErrors();
        this.valid = valid;
        if (throwFirstError && !this.valid) cancel();
      }
    });
    return this.valid;
  }

  validity() {
    this._validate = true;
    return this.validityBase();
  }

  @action
  async hasErrors(params?: {
    setErrors?: boolean;
    throwFirstError?: boolean;
  }) {
    const { setErrors = false, throwFirstError = false } = {
      ...params,
    };
    if (setErrors) this._validate = true;
    const valid = await this.validityBase({
      setErrors,
      throwFirstError,
    });
    return !valid;
  }

  @action
  addErrors(errors: Record<string, ValidationErrors>) {
    if (!this.validate) this.validate = true;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const error = errors[key];
        this.callbackField(field => {
          field.addErrors(error);
        });
      }
    }
  }

  @action
  setErrors(errors?: Record<string, ValidationErrors>) {
    errors && this.addErrors(errors);
  }

  async getErrors() {
    const fields: {
      [key: string]: ValidationErrors | undefined;
    } = {};
    for (const { name, errors, enabled } of this.fields)
      if (errors && enabled) fields[name] = errors;
    return fields;
  }
}

export default InputsValidator;
