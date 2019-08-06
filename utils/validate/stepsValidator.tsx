import produce from 'immer';
import { Step } from '../..';
import StepValidator from './stepValidator';

class StepsValidator {
  inValid = false;
  steps: Step[];
  stepError?: number;

  constructor(fields: Step[]) {
    this.steps = fields;
  }

  async haveErrors() {
    const steps = this.steps;
    this.steps = produce<Step[], Step[]>(steps, async draft => {
      draft.forEach(async (d, key) => {
        const fieldsErrors = new StepValidator(d);
        if ((await fieldsErrors.haveErrors()) && !this.inValid) {
          this.inValid = true;
          this.stepError = key;
        }
        draft[key] = fieldsErrors.step;
      });
    });
    return this.inValid;
  }
}

export default StepsValidator;
