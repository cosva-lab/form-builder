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
import { ComponentErrors } from '../../types';

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
  @observable public autoComplete?: string;
  @observable public inputProps?: InputPropsField;
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
      autoComplete,
      inputProps,
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
    this.autoComplete = autoComplete;
    this.inputProps = inputProps;
    this.textFieldProps = textFieldProps;
    this.breakpoints = breakpoints;
    this.component = component;
    this.renderErrors = renderErrors;
  }
}

export default FieldBuilder;
