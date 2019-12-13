import { observable } from 'mobx';
import cloneDeep from 'lodash/cloneDeep';
import {
  InitialStateSteps,
  EventField,
  Step,
  activeStep,
} from '../../types';
import StepsValidator from '../validate/stepsValidator';
import { changeValueSteps } from '../changeValues';
import StepValidator from '../validate/stepValidator';

declare type Callback = () => void;

declare type Props = InitialStateSteps;

export default class StepsBuilder extends StepsValidator
  implements InitialStateSteps {
  @observable ns?: string;
  @observable isNew?: boolean;
  @observable validate?: boolean;
  @observable activeStep: activeStep;
  @observable private originalParams: StepsBuilder;
  @observable private parmsLast?: StepsBuilder;

  constructor(props: Props) {
    super(props.steps);
    const { ns, isNew, validate, activeStep } = props;
    for (const step of this.steps) {
      for (const field of step.fields) {
        field.stepsBuilder = this;
        if (!field.ns) field.ns = ns;
      }
    }
    this.activeStep = activeStep;
    this.setProps({
      ns,
      isNew,
      validate,
      activeStep,
    });
    this.originalParams = cloneDeep(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.restore = this.restore.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.setNew = this.setNew.bind(this);
    this.setSteps = this.setSteps.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeSteps = this.changeSteps.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setErrors = this.setErrors.bind(this);
  }

  private setProps: (
    props: Pick<
      StepsBuilder,
      'ns' | 'isNew' | 'validate' | 'activeStep'
    >,
  ) => void = ({ ns, isNew, validate, activeStep }) => {
    this.ns = ns;
    this.isNew = isNew;
    this.validate = validate;
    this.activeStep = activeStep;
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
    callback && callback();
  }

  setActiveStep(value: number, callback?: Callback) {
    if (this.activeStep !== value)
      this.parmsLast = {
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

  private setSteps(steps: Step[], callback?: Callback) {
    const stepsTemp = steps.map(step => new StepValidator(step));
    this.steps = stepsTemp;
    callback && callback();
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
      steps.forEach(fields => {
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
