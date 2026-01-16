import {
  observable,
  action,
  makeObservable,
  runInAction,
} from 'mobx';

import { FieldsProps } from '../..';
import FieldBuilder from '../builders/FieldBuilder';
import type {
  ValidationErrors,
  ValidateInputsValidator,
  PropsField,
  GetArrayValues,
  GetFields,
  FieldType,
} from '../../types';
import { Reducer } from '../types';

class InputsValidator<
  Field extends FieldType,
  Item extends PropsField<Field> = PropsField<Field>,
  Fields extends Item[] = Item[],
  FieldsObject extends Reducer<Fields> = Reducer<Fields>,
> {
  @observable public valid = true;
  public get invalid() {
    return !this.valid;
  }
  @observable public fields: GetArrayValues<GetFields<FieldsObject>>;

  public fieldsMap = {} as GetFields<FieldsObject>;

  @observable public _validate: ValidateInputsValidator<
    Field,
    Item,
    Fields,
    FieldsObject
  > = false;
  public get validate() {
    return typeof this._validate === 'function'
      ? this._validate(this)
      : this._validate;
  }

  public set validate(
    validate:
      | ValidateInputsValidator<Field, Item, Fields, FieldsObject>
      | undefined,
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
  }: Pick<FieldsProps<Field, Item, Fields>, 'fields' | 'validate'>) {
    makeObservable(this);
    if (typeof validate !== 'undefined')
      this._validate = validate as any;
    this.callbackField = this.callbackField.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.fields = fields.map(
      (field) => new FieldBuilder(field as any),
    ) as unknown as GetArrayValues<GetFields<FieldsObject>>;
    for (const field of this.fields) {
      const name = field.name;
      this.fieldsMap[name as keyof FieldsObject] = field;
    }
  }

  async callbackField(
    callback: (
      field: GetFields<FieldsObject>[keyof FieldsObject],
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
  addErrors(errors: Record<string, ValidationErrors>) {
    if (!this.validate) this.validate = true;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const error = errors[key];
        this.callbackField((field) => {
          const keys = [field.name];
          if (keys.some((name) => name === key))
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
    const fieldsErrors: {
      [P in keyof FieldsObject]?: ValidationErrors;
    } = {};
    for (const { name, errors, enabled } of this.fields)
      if (errors && enabled)
        fieldsErrors[name as keyof FieldsObject] = errors;
    return fieldsErrors;
  }
}

export default InputsValidator;
