import { Step } from '../..';
import InputsValidator from './InputsValidator';

class StepValidator implements Step {
  inValid = false;
  actionsExtra: Step['actionsExtra'];
  elevation: Step['elevation'];
  extra: Step['extra'];
  fields: Step['fields'];
  isNew: Step['isNew'];
  label: Step['label'];
  ns: Step['ns'];
  stepper: Step['stepper'];
  transPosition: Step['transPosition'];
  validate: Step['validate'];
  validationState: Step['validationState'];

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
    const fieldsErrors = new InputsValidator(fields);
    if ((await fieldsErrors.haveErrors()) && !this.inValid) {
      this.inValid = true;
    }
    this.fields = fieldsErrors.fields;
    return this.inValid;
  }
}

export default StepValidator;
