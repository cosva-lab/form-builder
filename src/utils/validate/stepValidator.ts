import { observable } from 'mobx';
import { Step } from '../../types';
import FieldsBuilder from '../builders/FieldsBuilder';

export class StepValidator extends FieldsBuilder {
  @observable public elevation: Step['elevation'];
  @observable public label: Step['label'];
  @observable public stepper: Step['stepper'];

  constructor({
    elevation,
    extra,
    fields,
    isNew,
    label,
    ns,
    stepper,
    transPosition,
    validate,
  }: Step) {
    super({
      extra,
      fields,
      isNew,
      ns,
      transPosition,
      validate,
    });
    this.elevation = elevation;
    this.label = label;
    this.stepper = stepper;
  }
}

export default StepValidator;
