import { observable, makeObservable } from 'mobx';
import type {
  InitialStateSteps,
  EventField,
  StepProps,
  ActiveStep,
} from '../../types';
import { StepsValidator, StepValidator } from '../validate';
import { changeValueSteps } from '../changeValues';
import { cloneDeep } from '../../utils/cloneDeep';

declare type Callback = () => void;

declare type Props = InitialStateSteps;

declare type OriginalParams = {
  steps: StepProps[];
  ns?: string;
  validate?: boolean;
  activeStep: ActiveStep;
};

export class StepsBuilder
  extends StepsValidator
  implements InitialStateSteps
{
  @observable ns?: string;
  @observable validate?: boolean;
  @observable activeStep: ActiveStep;
  @observable private originalParams: OriginalParams;
  @observable private paramsLast?: StepsBuilder;

  constructor(props: Props) {
    super(props.steps);
    makeObservable(this);
    const { ns, validate, activeStep } = props;
    for (const step of this.steps) {
      step.stepsBuilder = this;
      for (const field of step.fields) {
        field.stepsBuilder = this;
        if (!field.ns) field.ns = ns;
      }
    }
    this.activeStep = activeStep;
    this.setProps({
      ns,
      validate,
      activeStep,
    });
    this.originalParams = cloneDeep({
      steps: props.steps,
      activeStep,
      ns,
      validate,
    });
    this.restoreLast = this.restoreLast.bind(this);
    this.restore = this.restore.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.setSteps = this.setSteps.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeSteps = this.changeSteps.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setErrors = this.setErrors.bind(this);
  }

  private setProps: (
    props: Pick<StepsBuilder, 'ns' | 'validate' | 'activeStep'>,
  ) => void = ({ ns, validate, activeStep }) => {
    this.ns = ns;
    this.validate = validate;
    this.activeStep = activeStep;
  };

  restoreLast() {
    if (this.paramsLast) {
      const { steps, ...rest } = this.paramsLast;
      this.setProps(rest);
      this.steps = steps;
      this.setSteps(steps);
      this.paramsLast = undefined;
    }
  }

  restore() {
    const { steps, ...rest } = this.originalParams;
    this.setProps(rest);
    this.setSteps(steps);
  }

  setActiveStep(value: number, callback?: Callback) {
    if (this.activeStep !== value)
      this.paramsLast = {
        ...this,
      };
    this.activeStep = value;
    callback && callback();
  }

  handleNextStep = (callback?: Callback) => {
    this.setActiveStep(this.activeStep + 1, callback);
  };

  handleBackStep = (callback?: Callback) => {
    this.setActiveStep(this.activeStep - 1, callback);
  };

  private setSteps(steps: StepProps[], callback?: Callback) {
    const stepsTemp = steps.map((step) => new StepValidator(step));
    this.steps = stepsTemp;
    callback && callback();
  }

  getFieldsObject() {
    const steps: {
      [key: string]: any;
    } = {};
    this.steps.forEach((step) => {
      step.fields.forEach(({ name, value }) => {
        steps[name] = value;
      });
    });
    return steps;
  }

  changeField(callback?: Callback) {
    return ({ target }: EventField) => {
      const { value, name } = target;
      changeValueSteps({
        activeStep: this.activeStep,
        steps: this.steps,
        action: {
          name,
          value,
        },
      });
      callback && callback();
    };
  }

  changeSteps(callback?: Callback) {
    return (steps: EventField[][]) => {
      steps.forEach((fields) => {
        for (const field of fields) {
          this.changeField()(field);
        }
      });
      this.setSteps(this.steps, callback);
    };
  }

  setValidation(validate: boolean, callback?: Callback) {
    this.validate = validate;
    callback && callback();
  }

  setErrors() {
    this.validate = true;
    this.steps = this.stepsWithErros;
  }
}

export default StepsBuilder;
