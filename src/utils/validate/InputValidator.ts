import { observable } from 'mobx';
import {
  Validation,
  ValidationFunction,
  value,
  Validate,
} from '../../types';
import FieldsBuilder from '../builders/FieldsBuilder';
import { StepsBuilder } from '../builders';

export class InputValidator<V = value> implements Validate<V> {
  @observable public fields?: FieldsBuilder;
  @observable public stepsBuilder?: StepsBuilder;
  @observable public validate?: boolean;
  @observable public value: V;
  @observable public validations?: (
    | Validation
    | ValidationFunction<V>
  )[];
  @observable public changed?: boolean;
  @observable public validChange?: boolean;
  @observable public state?: boolean;

  constructor({
    changed,
    state = true,
    validChange,
    validate,
    validations,
    value,
  }: Validate<V>) {
    this.changed = changed;
    this.state = state;
    this.validChange = validChange;
    this.validate = validate;
    // validations is an array of validation rules specific to a form
    this.validations = validations;
    this.value = value;
  }
}

export default InputValidator;
