import { observable } from 'mobx';

import {
  ExtraProps,
  InputPropsField,
  TextFieldPropsField,
  PropsField,
  value,
  RenderField,
  ComponentField,
  BreakpointsField,
} from '../../types';
import { InputValidator } from '../validate/InputValidator';
import { ComponentErrors, ValidationErrors } from '../../types';

class FieldBuilder<V = value> extends InputValidator<V>
  implements PropsField {
  @observable public extraProps?: ExtraProps;
  @observable private _ns?: string;
  public get ns(): string | undefined {
    return typeof this._ns === 'undefined'
      ? this.fieldsBuilder && this.fieldsBuilder.ns
      : this._ns;
  }

  public set ns(ns: string | undefined) {
    this._ns = ns;
  }

  @observable public render?: RenderField;
  @observable public waitTime?: boolean;
  @observable public fullWidth?: boolean;
  @observable public grid?: boolean;
  @observable public autoComplete?: string;
  @observable public InputProps?: InputPropsField;
  @observable public textFieldProps?: TextFieldPropsField;
  @observable public breakpoints?: BreakpointsField;
  @observable public component?: ComponentField;
  public renderErrors?: ComponentErrors;

  constructor(props: PropsField<V>) {
    super(props);
    const {
      extraProps,
      ns,
      render,
      waitTime,
      fullWidth = true,
      grid = true,
      autoComplete,
      InputProps,
      textFieldProps,
      breakpoints,
      component,
      renderErrors,
    } = props;

    this.extraProps = extraProps;
    this.ns = ns;
    this.render = render;
    this.waitTime = waitTime;
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

  public async getErrors(params?: {
    validate?: boolean;
  }): Promise<ValidationErrors | undefined> {
    const { validate = true } = { ...params };
    const { validations, value } = this;
    let messageResult: ValidationErrors = [];
    if (!validate && !this.dirty && !this.enabled)
      return messageResult;

    if (Array.isArray(validations) && validate) {
      for (const validation of validations) {
        if (typeof validation === 'object') {
          const res = this.hasValidationError(validation);
          if (res) {
            messageResult = [...messageResult, validation];
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
            errors.push(res);
          }
          if (res) messageResult = [...messageResult, ...errors];
        }
      }
    }
    return messageResult.length ? messageResult : undefined;
  }
}

export default FieldBuilder;
