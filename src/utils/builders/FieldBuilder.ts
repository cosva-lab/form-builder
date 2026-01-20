import {
  observable,
  action,
  toJS,
  makeObservable,
  runInAction,
} from 'mobx';

import type {
  InputPropsField,
  TextFieldPropsField,
  PropsField,
  RenderField,
  ComponentField,
  FieldError,
  FieldType,
  GetErrors,
} from '../../types';
import { InputValidator } from '../validate/InputValidator';

export class FieldBuilder<
  Field extends FieldType<any, any, any, any>,
> extends InputValidator<Field> {
  @observable private _ns?: string = undefined;
  public get ns(): string | undefined {
    return typeof this._ns === 'undefined'
      ? this.fieldsBuilder && this.fieldsBuilder.ns
      : this._ns;
  }

  public set ns(ns: string | undefined) {
    this._ns = ns;
  }

  @observable public render?: RenderField<Field> = undefined;
  @observable public fullWidth?: boolean = undefined;
  @observable public autoComplete?: string = undefined;
  @observable public InputProps?: InputPropsField<Field> = undefined;
  @observable public textFieldProps?: TextFieldPropsField = undefined;
  @observable public component?: ComponentField<Field> = undefined;

  constructor(props: PropsField<Field>) {
    super(props);
    makeObservable(this);
    const {
      ns,
      render,
      fullWidth = true,
      autoComplete,
      InputProps,
      textFieldProps,
      component,
    } = props;
    this.validate = InputValidator.getValidation<Field>(this);
    this.ns = ns;
    this.render = render;
    this.fullWidth = fullWidth;
    this.autoComplete = autoComplete;
    this.InputProps = InputProps;
    this.textFieldProps = textFieldProps;
    this.component = component;
    this.getErrors = this.getErrors.bind(this);
  }

  protected async getErrorsBase(props?: {
    sequential: boolean;
  }): Promise<GetErrors<Field['validations']> | undefined> {
    const { sequential = false } = { ...props };
    const { validations, value } = this;

    if (typeof this.validate !== 'function') this._validate = true;
    const validate = this.validate;
    let errors: GetErrors<Field['validations']> | undefined =
      undefined;
    if (!validate && !this.dirty && !this.enabled) return errors;

    if (Array.isArray(validations) && validate) {
      for (const validation of validations) {
        let error: FieldError | undefined;
        if (typeof validation === 'object') {
          if (this.hasValidationError(validation)) error = validation;
        } else if (typeof validation === 'function') {
          error = await validation({
            field: this,
            validate,
            value,
          });
        }
        if (error) {
          errors = [
            ...((errors || []) as unknown as Record<string, any>[]),
            error,
          ] as GetErrors<Field['validations']>;

          if (sequential) break;
        }
      }
    }
    return errors?.length ? errors : undefined;
  }

  public getErrors(): Promise<
    GetErrors<Field['validations']> | undefined
  > {
    return this.getErrorsBase();
  }

  public async hasErrors(): Promise<boolean> {
    const errors = await this.getErrorsBase({ sequential: true });
    return !!(errors && errors.length);
  }

  public async hasValid(): Promise<boolean> {
    const hasErrors = await this.hasErrors();
    return !hasErrors;
  }

  @action
  async setValue(value: Field['value']) {
    runInAction(() => {
      this.value = value;
    });
    this.markAsDirty();
    this.markAsTouched();
    if (
      typeof this.validate !== 'undefined'
        ? this.validate
        : this.dirty
    ) {
      runInAction(() => {
        this.updateValueAndValidity();
      });
    }
    this.onSetValue?.({
      lastValue: toJS(this.value),
      newValue: value,
      field: this,
    });
  }
}

export default FieldBuilder;
