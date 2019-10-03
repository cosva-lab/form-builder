import { observable } from 'mobx';

import { Step } from '../..';
import InputsValidator from './InputsValidator';

class StepValidator implements Step {
  @observable private inValid = false;
  @observable public actionsExtra: Step['actionsExtra'];
  @observable public elevation: Step['elevation'];
  @observable public extra: Step['extra'];
  @observable public fields: Step['fields'];
  @observable public isNew: Step['isNew'];
  @observable public label: Step['label'];
  @observable public ns: Step['ns'];
  @observable public stepper: Step['stepper'];
  @observable public transPosition: Step['transPosition'];
  @observable public validate: Step['validate'];
  @observable public validationState: Step['validationState'];

  constructor({
    actionsExtra,
    elevation,
    extra,
    fields,
    isNew,
    label,
    ns,
    stepper,
    transPosition,
    validate,
    validationState,
  }: Step) {
    this.actionsExtra = actionsExtra;
    this.elevation = elevation;
    this.extra = extra;
    this.fields = fields;
    this.isNew = isNew;
    this.label = label;
    this.ns = ns;
    this.stepper = stepper;
    this.transPosition = transPosition;
    this.validate = validate;
    this.validationState = validationState;
    this.haveErrors = this.haveErrors.bind(this);
  }

  async haveErrors() {
    const fields = this.fields;
    this.inValid = false;
    const fieldsErrors = new InputsValidator(fields);
    if (await fieldsErrors.haveErrors()) {
      this.inValid = true;
    }
    return this.inValid;
  }
}

export default StepValidator;
