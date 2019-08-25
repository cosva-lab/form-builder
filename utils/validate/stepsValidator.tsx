import produce from 'immer';
import { Step } from '../..';
import StepValidator from './stepValidator';
import { ComponentStepsBuilder, StateStepsBuilder } from '..';

class StepsValidator {
  inValid = false;
  steps: StepValidator[];
  protected stepError?: number;
  protected stepsWithErros: StepValidator[];

  constructor(steps: Step[]) {
    this.steps = steps.map(step => new StepValidator(step));
    this.stepsWithErros = [...this.steps];
    this.haveErrors = this.haveErrors.bind(this);
    this.setErrors = this.setErrors.bind(this);
  }

  async haveErrors() {
    const steps = this.steps;
    this.stepsWithErros = await produce<
      StepValidator[],
      StepValidator[]
    >(steps, async draft => {
      for (const key in draft) {
        if (draft.hasOwnProperty(key)) {
          const stepValidator = draft[key];
          if ((await stepValidator.haveErrors()) && !this.inValid) {
            this.inValid = true;
            this.stepError = Number(key);
            break;
          }
          draft[key] = stepValidator;
        }
      }
    });
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
