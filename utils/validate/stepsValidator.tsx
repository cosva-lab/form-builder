import produce from 'immer';
import { observable } from 'mobx';
import { Step } from '../..';
import StepValidator from './stepValidator';
import { ComponentStepsBuilder, StateStepsBuilder } from '..';

class StepsValidator {
  @observable inValid = false;
  @observable steps: StepValidator[];
  @observable protected stepError?: number;
  @observable protected stepsWithErros: StepValidator[];

  constructor(steps: Step[]) {
    this.steps = steps.map(step => new StepValidator(step));
    this.stepsWithErros = [...this.steps];
    this.haveErrors = this.haveErrors.bind(this);
    this.setErrors = this.setErrors.bind(this);
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

  setErrors(component: ComponentStepsBuilder) {
    component.setState(state =>
      produce<StateStepsBuilder, StateStepsBuilder>(
        state,
        (draft): void => {
          draft.fieldsRender.validate = true;
          draft.fieldsRender.steps = this.stepsWithErros;
        },
      ),
    );
  }
}

export default StepsValidator;
