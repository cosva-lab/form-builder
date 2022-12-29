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
  value,
  RenderField,
  ComponentField,
  BreakpointsField,
  ComponentErrors,
  ValidationErrors,
  ReturnValidationError,
} from '../../types';
import { InputValidator } from '../validate/InputValidator';

export class FieldBuilder<V = value>
  extends InputValidator<V>
  implements PropsField
{
  @observable private _ns?: string = undefined;
  public get ns(): string | undefined {
    return typeof this._ns === 'undefined'
      ? this.fieldsBuilder && this.fieldsBuilder.ns
      : this._ns;
  }

  public set ns(ns: string | undefined) {
    this._ns = ns;
  }

  @observable public render?: RenderField = undefined;
  @observable public fullWidth?: boolean = undefined;
  @observable public grid?: boolean = undefined;
  @observable public autoComplete?: string = undefined;
  @observable public InputProps?: InputPropsField = undefined;
  @observable public textFieldProps?: TextFieldPropsField = undefined;
  @observable public breakpoints?: BreakpointsField = undefined;
  @observable public component?: ComponentField = undefined;
  public renderErrors?: ComponentErrors;

  constructor(props: PropsField<V>) {
    super(props);
    makeObservable(this);
    const {
      ns,
      render,
      fullWidth = true,
      grid = true,
      autoComplete,
      InputProps,
      textFieldProps,
      breakpoints,
      component,
      renderErrors,
    } = props;
    this.validate = InputValidator.getValidation(this);
    this.ns = ns;
    this.render = render;
    this.fullWidth = fullWidth;
    this.grid = grid;
    this.autoComplete = autoComplete;
    this.InputProps = InputProps;
    this.textFieldProps = textFieldProps;
    this.breakpoints = breakpoints;
    this.component = component;
    this.renderErrors = renderErrors;
    this.getErrors = this.getErrors.bind(this);
  }

  protected async getErrorsBase(props?: {
    sequential: boolean;
  }): Promise<ValidationErrors | undefined> {
    const { sequential = false } = { ...props };
    const { validations, value } = this;

    if (typeof this.validate !== 'function') this._validate = true;
    const validate = this.validate;
    let errors: ValidationErrors = [];
    if (!validate && !this.dirty && !this.enabled) return errors;

    if (Array.isArray(validations) && validate) {
      for (const validation of validations) {
        let error: ReturnValidationError | undefined;
        if (typeof validation === 'object') {
          if (this.hasValidationError(validation)) error = validation;
        } else if (typeof validation === 'function') {
          error = await validation({
            field: this,
            fieldsBuilder: this.fieldsBuilder,
            stepsBuilder: this.stepsBuilder,
            validate,
            value,
          });
        }
        if (error) {
          errors = [...errors, error];
          if (sequential) break;
        }
      }
    }
    return errors.length ? errors : undefined;
  }

  public getErrors(): Promise<ValidationErrors | undefined> {
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
  async setValue(value: V) {
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
    this.onSetValue &&
      this.onSetValue({
        lastValue: toJS(this.value),
        newValue: value,
        field: this,
      });
  }
}

export default FieldBuilder;
