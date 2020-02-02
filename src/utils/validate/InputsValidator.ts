import { observable } from 'mobx';

import { FieldsProps } from '../..';
import FieldBuilder from '../builders/FieldBuilder';
import { ValidationErrors } from '../../types';

class InputsValidator {
  @observable public valid = true;
  public get invalid() {
    return !this.valid;
  }
  @observable public fields: FieldBuilder[];
  @observable public _validate?: boolean;
  public get validate() {
    return this._validate;
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
    this.fields = fields.map(
      field => new FieldBuilder({ ...field, validate }),
    );
    this.validate = validate;
    this.callbackField = this.callbackField.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
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

  private async validityBase(args?: {
    setErrors?: boolean;
    throwFirstError?: boolean;
  }) {
    this.valid = true;
    const { setErrors = true, throwFirstError = false } = { ...args };
    await this.callbackField(async (field, cancel) => {
      if (field.enabled) {
        const fieldView = setErrors ? field : new FieldBuilder(field);
        fieldView._validate = true;
        await fieldView.hasErrors();
        if (!fieldView.valid) this.valid = fieldView.valid;
        if (throwFirstError) cancel();
      }
    });
  }

  async validity() {
    this._validate = true;
    await this.validityBase();
  }

  async hasErrors(params?: {
    setErrors?: boolean;
    throwFirstError?: boolean;
  }) {
    const { setErrors = false, throwFirstError = false } = {
      ...params,
    };
    if (setErrors) this._validate = true;
    await this.validityBase({ setErrors, throwFirstError });
    return this.invalid;
  }

  async addErrors(errors: Record<string, string | string[]>) {
    if (!this.validate) this.validate = true;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const e = errors[key];
        const error: string[] = [];
        if (typeof e === 'string') {
          error.push(e);
        } else {
          error.push(...e);
        }
        await this.callbackField(field => {
          const serverError = field.serverError || field.name;
          const serverErrors: string[] = [];
          if (typeof serverError === 'string') {
            serverErrors.push(serverError);
          } else if (serverError) {
            serverErrors.push(...serverError);
          }
          if (serverErrors.find(name => name === key)) {
            field.errors = error;
          }
        });
      }
    }
    return this.fields;
  }

  async setErrors(errors?: Record<string, string | string[]>) {
    errors && (await this.addErrors(errors));
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
