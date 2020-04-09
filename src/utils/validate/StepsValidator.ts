import { observable } from 'mobx';
import StepValidator from './StepValidator';
import { StepProps } from '../../types';

class StepsValidator {
  @observable inValid = false;
  @observable steps: StepValidator[];
  @observable protected stepError?: number;
  @observable protected stepsWithErros: StepValidator[];

  constructor(steps: StepProps[]) {
    this.steps = steps.map(step => new StepValidator(step));
    this.stepsWithErros = [...this.steps];
    this.hasErrors = this.hasErrors.bind(this);
  }

  async hasErrors() {
    for (const key in this.steps) {
      if (this.steps.hasOwnProperty(key)) {
        const stepValidator = this.steps[key];
        if ((await stepValidator.hasErrors()) && !this.inValid) {
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

export { StepsValidator };
export default StepsValidator;
