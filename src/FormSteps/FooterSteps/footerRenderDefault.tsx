import { Props } from './index';

export const footerRenderDefault: Required<Props>['footerRender'] = ({
  stepsLength, footerSteps, ...rest
}) => {
  const activeStep = rest.activeStep;
  let steps = {
    next: {
      message: activeStep !== stepsLength - 1 ? 'next' : 'done',
      state: true,
      ns: 'general',
    },
    back: {
      message: 'back',
      state: true,
      ns: 'general',
    },
  };
  if (footerSteps) {
    Object.keys(footerSteps).forEach(step => {
      if (activeStep.toString() === step) {
        if (footerSteps.hasOwnProperty(step)) {
          const footerStep = footerSteps[activeStep];
          const next = (footerStep && footerStep.next) || {};
          const back = (footerStep && footerStep.back) || {};
          steps = {
            ...steps,
            next: { ...steps.next, ...next },
            back: { ...steps.back, ...back },
          };
        }
      }
    });
  }
  return steps;
};
