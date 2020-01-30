import { observable, toJS } from 'mobx';
import {
  ExtraProps,
  InputPropsField,
  TextFieldPropsField,
  GlobalProps,
  PropsField,
  value,
  RenderField,
  ComponentField,
  BreakpointsField,
} from '../../types';
import { InputValidator } from '../validate/InputValidator';

class FieldBuilder<V = value> extends InputValidator<V>
  implements PropsField {
  @observable public extraProps?: ExtraProps;
  @observable public globalProps?: GlobalProps;
  @observable public ns?: string;
  @observable public render?: RenderField;
  @observable public waitTime?: boolean;
  @observable public fullWidth?: boolean;
  @observable public autoComplete?: string;
  @observable public inputProps?: InputPropsField;
  @observable public textFieldProps?: TextFieldPropsField;
  @observable public breakpoints?: BreakpointsField;
  @observable public component?: ComponentField;

  static formatParams<V = value>(
    props: PropsField<V> | FieldBuilder<V>,
  ): PropsField<V> {
    const {
      autoComplete,
      breakpoints,
      component,
      defaultInputValue,
      disabled,
      error,
      globalProps: extra,
      extraProps,
      fullWidth = true,
      inputProps,
      label,
      name,
      ns,
      render,
      serverError,
      textFieldProps,
      type,
      value,
      waitTime,
      // Validations
      changed,
      validChange,
      validate,
      validations,
    } = toJS(props);

    return {
      autoComplete,
      breakpoints,
      component,
      defaultInputValue,
      disabled,
      error,
      globalProps: extra,
      extraProps,
      fullWidth,
      inputProps,
      label,
      name,
      ns,
      render,
      serverError,
      textFieldProps,
      type,
      value,
      waitTime,
      // Validations
      changed,
      validChange,
      validate,
      validations,
    };
  }

  constructor(props: PropsField<V>) {
    super(props);
    const {
      extraProps,
      globalProps: extra,
      ns,
      render,
      waitTime,
      fullWidth,
      autoComplete,
      inputProps,
      textFieldProps,
      breakpoints,
      component,
    } = FieldBuilder.formatParams(props);

    this.extraProps = extraProps;
    this.globalProps = extra;
    this.ns = ns;
    this.render = render;
    this.waitTime = waitTime;
    this.fullWidth = fullWidth;
    this.autoComplete = autoComplete;
    this.inputProps = inputProps;
    this.textFieldProps = textFieldProps;
    this.breakpoints = breakpoints;
    this.component = component;
  }
}

export default FieldBuilder;
