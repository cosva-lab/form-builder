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

class FieldBuilder<V = value> extends InputValidator<V>
  implements PropsField {
  @observable public extraProps?: ExtraProps;
  @observable public ns?: string;
  @observable public render?: RenderField;
  @observable public waitTime?: boolean;
  @observable public fullWidth?: boolean;
  @observable public autoComplete?: string;
  @observable public inputProps?: InputPropsField;
  @observable public textFieldProps?: TextFieldPropsField;
  @observable public breakpoints?: BreakpointsField;
  @observable public component?: ComponentField;

  constructor(props: PropsField<V>) {
    super(props);
    const {
      extraProps,
      globalProps,
      ns,
      render,
      waitTime,
      fullWidth = true,
      autoComplete,
      inputProps,
      textFieldProps,
      breakpoints,
      component,
    } = props;

    this.extraProps = extraProps;
    this.globalProps = globalProps;
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
