import { observable } from 'mobx';
import {
  ExtraProps,
  LabelPropsField,
  ErrorField,
  InputPropsField,
  TextFieldPropsField,
} from '../..';
import { extra, transPosition } from '../..';
import {
  PropsField,
  value,
  TypeField,
  RenderField,
  ComponentField,
} from '../../types';
import InputValidator from '../validate/InputValidator';
import { BreakpointsField } from '../../types';

class FieldBuilder<V = value> extends InputValidator<V>
  implements PropsField {
  @observable public fields?: PropsField[];
  @observable public extraProps?: ExtraProps;
  @observable public extra?: extra;
  @observable public type?: TypeField;
  @observable public name: string;
  @observable public value: V;
  @observable public defaultInputValue?: V;
  @observable public label?: LabelPropsField;
  @observable public ns?: string;
  @observable public render?: RenderField;
  @observable public disabled?: boolean;
  @observable public waitTime?: boolean;
  @observable public fullWidth?: boolean;
  @observable public transPosition?: transPosition;
  @observable public error?: ErrorField;
  @observable public serverError?: string[] | string;
  @observable public autoComplete?: string;
  @observable public inputProps?: InputPropsField;
  @observable public textFieldProps?: TextFieldPropsField;
  @observable public breakpoints?: BreakpointsField;
  @observable public component?: ComponentField;

  constructor({
    autoComplete,
    breakpoints,
    component,
    defaultInputValue,
    disabled,
    error,
    extra,
    extraProps,
    fullWidth,
    inputProps,
    label,
    name,
    ns,
    render,
    serverError,
    state,
    textFieldProps,
    transPosition,
    type,
    value,
    waitTime,
    // Validations
    changed,
    validChange,
    validate,
    validations,
  }: PropsField<V>) {
    super({
      changed,
      validChange,
      validate,
      validations,
      value,
    });
    Object.assign(this, {
      autoComplete,
      breakpoints,
      component,
      defaultInputValue,
      disabled,
      error,
      extra,
      extraProps,
      fullWidth,
      inputProps,
      label,
      name,
      ns,
      render,
      serverError,
      state,
      textFieldProps,
      transPosition,
      type,
      value,
      waitTime,
    });
  }
}

export default FieldBuilder;
