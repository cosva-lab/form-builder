import { observable } from 'mobx';
import { Step } from '../../types';
import FieldsBuilder from '../builders/FieldsBuilder';

export class StepValidator extends FieldsBuilder {
  @observable public elevation: Step['elevation'];
  @observable public label: Step['label'];
  @observable public stepper: Step['stepper'];

  constructor({
    elevation,
    globalProps,
    fields,
    label,
    ns,
    stepper,
    validate,
  }: Step) {
    super({
      globalProps,
      fields,
      ns,
      validate,
    });
    this.elevation = elevation;
    this.label = label;
    this.stepper = stepper;
  }
}

export default StepValidator;
