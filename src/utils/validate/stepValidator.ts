import { observable } from 'mobx';
import { StepProps } from '../../types';
import FieldsBuilder from '../builders/FieldsBuilder';

export class StepValidator extends FieldsBuilder {
  @observable public elevation: StepProps['elevation'];
  @observable public label: StepProps['label'];
  @observable public stepper: StepProps['stepper'];

  constructor({
    elevation,
    globalProps,
    fields,
    label,
    ns,
    stepper,
    validate,
  }: StepProps) {
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
