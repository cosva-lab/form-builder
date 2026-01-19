import {
  observable,
  action,
  makeObservable,
  runInAction,
} from 'mobx';

import { FieldsProps } from '../../types';
import FieldBuilder from '../builders/FieldBuilder';
import type {
  ValidateInputsValidator,
  FieldType,
  FieldsToObject,
  PropsField,
  ValidationError,
} from '../../types';

class InputsValidator<Fields extends FieldBuilder<any>[]> {
  @observable public valid = true;
  public get invalid() {
    return !this.valid;
  }
  @observable public fields: Fields;

  public fieldsMap = {} as FieldsToObject<Fields>;

  @observable public _validate: ValidateInputsValidator<Fields> =
    false;
  public get validate() {
    return typeof this._validate === 'function'
      ? this._validate(this)
      : this._validate;
  }

  public set validate(
    validate: ValidateInputsValidator<Fields> | undefined,
  ) {
    this._validate = validate;
    if (validate) this.validity();
    for (const field of this.fields || [])
      if (validate && !field._validate) field._validate = true;
      else field.errors = undefined;
  }

  constructor({
    fields,
    validate,
  }: Pick<FieldsProps<Fields>, 'fields' | 'validate'>) {
    makeObservable(this);
    if (typeof validate !== 'undefined')
      this._validate = validate as any;
    this.callbackField = this.callbackField.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.fields = fields;
    for (const field of this.fields) {
      const name = field.name as keyof FieldsToObject<Fields>;
      this.fieldsMap[name] =
        field as FieldsToObject<Fields>[keyof FieldsToObject<Fields>];
    }
  }

  async callbackField(
    callback: (
      field: FieldBuilder<FieldType>,
      cancel: () => void,
    ) => void,
  ) {
    const fields = this.fields;
    for (const field of this.fields || []) {
      let cancel = false;
      await callback(field, () => (cancel = true));
      if (cancel) break;
    }
    return fields;
  }

  @action
  private async validityBase(args?: {
    setErrors?: boolean;
    throwFirstError?: boolean;
    validateDisabled?: boolean;
  }) {
    this.valid = true;
    const {
      setErrors = true,
      throwFirstError = false,
      validateDisabled = false,
    } = { ...args };
    await this.callbackField(async (field, cancel) => {
      if (field.enabled || validateDisabled) {
        const valid = setErrors
          ? await field.validity()
          : !(await field.hasErrors());
        runInAction(() => {
          if (!valid) this.valid = valid;
        });
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
    validateDisabled?: boolean;
  }) {
    const {
      setErrors = false,
      throwFirstError = false,
      validateDisabled = false,
    } = {
      ...params,
    };
    if (setErrors) this._validate = true;
    const valid = await this.validityBase({
      setErrors,
      throwFirstError,
      validateDisabled,
    });
    return !valid;
  }

  @action
  addErrors<Field extends Fields[number]>(
    errors: Record<Field['name'], ValidationError[]>,
  ) {
    if (!this.validate) this.validate = true;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const error = errors[key as keyof typeof errors];
        this.callbackField((field) => {
          if (field.name === key)
            field.addErrors(error as ValidationError[]);
        });
      }
    }
  }

  @action
  setErrors<Field extends Fields[number]>(
    errors?: Record<Field['name'], ValidationError[]>,
  ) {
    errors && this.addErrors(errors);
  }

  async getErrors() {
    type ObjectFields = FieldsToObject<Fields>;
    const fieldsErrors = {} as {
      [P in keyof ObjectFields]: ObjectFields[P]['errors'];
    };
    for (const { name, errors, enabled } of this.fields)
      if (errors && enabled)
        fieldsErrors[name as keyof FieldsToObject<Fields>] =
          errors as unknown as any;
    return fieldsErrors;
  }
}

export default InputsValidator;
