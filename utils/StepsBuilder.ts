import produce from 'immer';
import { InitialStateSteps, EventField, Step } from '..';
import StepsValidator from './validate/stepsValidator';
import { ComponentStepsBuilder, StateStepsBuilder } from '.';
import { changeValueSteps } from './changeValues';
import cloneDeep from 'lodash/cloneDeep';
import { activeStep } from '../index';
import StepValidator from './validate/stepValidator';

declare type Callback = () => void;

declare interface Props extends InitialStateSteps {
  changeStateComponent?: boolean;
}

export default class StepsBuilder extends StepsValidator
  implements InitialStateSteps {
  ns?: string;
  isNew?: boolean;
  validationState?: boolean;
  validate?: boolean;
  activeStep: activeStep;
  private component?: ComponentStepsBuilder;
  private originalParams: StepsBuilder;
  private parmsLast?: StepsBuilder;
  private changeStateComponent: boolean;

  constructor(props: Props) {
    super(props.steps);
    const {
      ns,
      isNew,
      validationState,
      validate,
      changeStateComponent = false,
      activeStep,
    } = props;
    this.activeStep = activeStep;
    this.setProps({
      ns,
      isNew,
      validationState,
      validate,
      activeStep,
    });
    this.changeStateComponent = changeStateComponent;
    this.originalParams = cloneDeep(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.restore = this.restore.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.setNew = this.setNew.bind(this);
    this.setSteps = this.setSteps.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeSteps = this.changeSteps.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setComponent = this.setComponent.bind(this);
    this.setErrors = this.setErrors.bind(this);
  }

  private setProps: (
    props: Pick<
      StepsBuilder,
      'ns' | 'isNew' | 'validationState' | 'validate' | 'activeStep'
    >,
  ) => void = ({
    ns,
    isNew,
    validationState,
    validate,
    activeStep,
  }) => {
    this.ns = ns;
    this.isNew = isNew;
    this.validationState = validationState;
    this.validate = validate;
    this.activeStep = activeStep;
  };

  setChangeStateComponent = (changeStateComponent: boolean) => {
    this.changeStateComponent = changeStateComponent;
  };

  restoreLast() {
    if (this.parmsLast) {
      const { steps, ...rest } = this.parmsLast;
      this.setProps(rest);
      this.steps = steps;
      this.setSteps(steps);
      this.parmsLast = undefined;
    }
  }

  restore() {
    const { steps, ...rest } = this.originalParams;
    this.setProps(rest);
    this.steps = steps;
    this.setSteps(steps);
  }

  setNew(value: boolean, callback?: Callback) {
    if (this.isNew !== value)
      this.parmsLast = {
        ...this,
      };
    this.isNew = value;
    if (this.component && this.changeStateComponent) {
      this.component.setState(
        state =>
          produce<StateStepsBuilder, StateStepsBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.isNew = value;
            },
          ),
        callback,
      );
    }
  }

  setActiveStep(value: number, callback?: Callback) {
    if (this.activeStep !== value)
      this.parmsLast = {
        ...this,
      };
    this.activeStep = value;
    if (this.component) {
      this.component.setState(
        state =>
          produce<StateStepsBuilder, StateStepsBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.activeStep = value;
            },
          ),
        callback,
      );
    } else {
      console.error(
        'Debe usar setComponent para poder cambiar de paso',
      );
    }
  }

  handleNextStep = () => {
    this.setActiveStep(this.activeStep + 1);
  };

  handleBackStep = () => {
    this.setActiveStep(this.activeStep - 1);
  };

  private setSteps(steps: Step[], callback?: Callback) {
    const stepsTemp = steps.map(step => new StepValidator(step));
    if (this.component && this.changeStateComponent) {
      this.component.setState(
        state =>
          produce<StateStepsBuilder, StateStepsBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.steps = stepsTemp;
            },
          ),
        callback,
      );
    }
    this.steps = stepsTemp;
  }

  getFieldsObject() {
    const steps: {
      [key: string]: any;
    } = {};
    this.steps.forEach(step => {
      step.fields.forEach(({ name, value }) => {
        steps[name] = value;
      });
    });
    return steps;
  }

  changeField(callback?: Callback) {
    return ({ target }: EventField) => {
      const { value, name } = target;
      const { steps, activeStep } = this;
      const valueSteps = changeValueSteps({
        activeStep,
        steps,
        action: {
          name,
          value,
        },
      });
      if (this.component && this.changeStateComponent) {
        this.setSteps(valueSteps, callback);
      }
      this.steps = valueSteps;
    };
  }

  changeSteps(callback?: Callback) {
    return (steps: EventField[][]) => {
      const setState = this.changeStateComponent;
      this.changeStateComponent = false;
      steps.forEach(fields => {
        for (const field of fields) {
          this.changeField()(field);
        }
      });
      this.changeStateComponent = setState;
      this.setSteps(this.steps, callback);
    };
  }

  setValidation(validate: boolean, callback?: Callback) {
    if (this.component && this.changeStateComponent) {
      this.component.setState(
        state =>
          produce<StateStepsBuilder, StateStepsBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.validate = validate;
            },
          ),
        callback,
      );
    }
    this.validate = validate;
  }

  setErrors() {
    if (this.component) {
      this.component.setState(state =>
        produce<StateStepsBuilder, StateStepsBuilder>(
          state,
          (draft): void => {
            draft.fieldsRender.validate = true;
            draft.fieldsRender.steps = this.stepsWithErros;
          },
        ),
      );
    } else {
      this.validate = true;
      this.steps = this.stepsWithErros;
    }
  }

  setComponent(component: ComponentStepsBuilder) {
    this.component = component;
  }
}
