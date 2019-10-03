import { observable } from 'mobx';
import { Step } from '../..';
import StepValidator from './stepValidator';

class StepsValidator {
  @observable inValid = false;
  @observable steps: StepValidator[];
  @observable protected stepError?: number;
  @observable protected stepsWithErros: StepValidator[];

  constructor(steps: Step[]) {
    this.steps = steps.map(step => new StepValidator(step));
    this.stepsWithErros = [...this.steps];
    this.haveErrors = this.haveErrors.bind(this);
  }

  async haveErrors() {
    for (const key in this.steps) {
      if (this.steps.hasOwnProperty(key)) {
        const stepValidator = this.steps[key];
        if ((await stepValidator.haveErrors()) && !this.inValid) {
          this.inValid = true;
          this.stepError = Number(key);
          break;
        }
        this.steps[key] = stepValidator;
      }
    }
    return this.inValid;
  }
}

export default StepsValidator;
