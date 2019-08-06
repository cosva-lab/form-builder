import produce from 'immer';
import { Step } from '../..';
import InputsValidator from './InputsValidator';

class StepValidator {
  inValid = false;
  step: Step;

  constructor(step: Step) {
    this.step = step;
  }

  async haveErrors() {
    const step = this.step;
    this.step = produce<Step, Step>(step, async draft => {
      const fieldsErrors = new InputsValidator(draft.fields);
      if ((await fieldsErrors.haveErrors()) && !this.inValid) {
        this.inValid = true;
      }
      draft.fields = fieldsErrors.fields;
    });
    return this.inValid;
  }
}

export default StepValidator;
