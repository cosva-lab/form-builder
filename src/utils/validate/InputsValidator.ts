import { observable } from 'mobx';
import { FieldsRenderProps } from '../..';
import FieldBuilder from '../builders/FieldBuilder';
import { ErrorField } from '../../types';
import { createViewModel } from 'mobx-utils';

class InputsValidator {
  @observable public valid = true;
  public get inValid() {
    return !this.valid;
  }
  @observable public fields: FieldBuilder[];
  public _validate?: boolean;
  public get validate() {
    return this._validate;
  }

  public set validate(validate: boolean | undefined) {
    this._validate = validate;
    if (validate) this.validity();
    for (const field of this.fields) {
      if (validate) {
        field._validate = true;
      } else {
        field.error = undefined;
      }
    }
  }

  constructor({
    fields,
    validate,
  }: Pick<FieldsRenderProps, 'fields' | 'validate'>) {
    this.fields = fields.map(
      field => new FieldBuilder({ ...field, validate }),
    );
    this.validate = validate;
    this.callbackField = this.callbackField.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.haveErrors = this.haveErrors.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
  }

  async callbackField(callback: (field: FieldBuilder) => void) {
    const fields = this.fields;
    for (const field of this.fields) {
      await callback(field);
    }
    return fields;
  }

  private async validityBase(setErrors: boolean = true) {
    this.valid = true;
    await this.callbackField(async field => {
      field._validate = true;
      await field.hasErrors({ setErrors });
      if (field.valid) this.valid = field.valid;
    });
  }

  async validity() {
    await this.validityBase();
  }

  async hasErrors(params?: { setErrors: boolean }) {
    const { setErrors = false } = { ...params };
    await this.validityBase(setErrors);
    return this.inValid;
  }

  /**
   * @param params
   * @deprecated Please use `hasErrors`
   */
  async haveErrors(params?: { setErrors: boolean }) {
    return this.hasErrors(params);
  }

  async addErrors(errors: Record<string, string | string[]>) {
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
            field.error = observable({
              message: error[0],
              state: true,
              errorServer: true,
            });
          }
        });
      }
    }
    return this.fields;
  }

  async getErrors() {
    const fields: {
      [key: string]: ErrorField[] | undefined;
    } = {};
    for (const field of this.fields) {
      const viewField = createViewModel(field);
      const { name } = viewField;
      const errors = await viewField.getErrors({ validate: true });
      if (errors) fields[name] = errors;
    }
    return fields;
  }
}

export default InputsValidator;
