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

  haveErrors() {
    const steps = this.steps;
    this.steps = produce<Step[], Step[]>(steps, (draft): void => {
      draft.forEach((d, key) => {
        const fieldsErrors = new StepValidator(d);
        if (fieldsErrors.haveErrors() && !this.inValid) {
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
