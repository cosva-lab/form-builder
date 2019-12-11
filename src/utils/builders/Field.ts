import { observable } from 'mobx';
import FieldsBuilder from './FieldsBuilder';
import StepsBuilder from './StepsBuilder';
import {
  LabelPropsField,
  value,
  TypeField,
  PropsFieldBase,
} from '../../types';

class Field<V = value> implements PropsFieldBase<V> {
  @observable public fieldsBuilder?: FieldsBuilder;
  @observable public stepsBuilder?: StepsBuilder;
  @observable public type?: TypeField;
  @observable public name: string;
  @observable public value: V;
  @observable public disabled?: boolean;
  @observable public defaultInputValue?: V;
  @observable public label?: LabelPropsField;
  @observable public state?: boolean;

  constructor({
    type,
    name,
    value,
    disabled,
    defaultInputValue,
    label,
    state = true,
  }: PropsFieldBase) {
    this.type = type;
    this.name = name;
    this.value = value;
    this.disabled = disabled;
    this.defaultInputValue = defaultInputValue;
    this.label = label;
    this.state = state;
  }
}

export default Field;
