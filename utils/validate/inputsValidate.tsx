import InputsValidator from './InputsValidator';
import { Step, InitialState, PropsField } from '../../index';

const inputsValidate = ({ activeStep = 0, steps }: InitialState) => {
  const stepsVar = steps;
  stepsVar[activeStep] = { ...stepsVar[activeStep], validate: true };
  return {
    steps: [...stepsVar],
    activeStep: new InputsValidator().validate({
      step: steps[activeStep],
    })
      ? activeStep + 1
      : activeStep,
  };
};

const showErrorValidations = ({
  steps,
  errors,
}: {
  steps: Step[];
  errors: any;
}) => {
  let errorStep: boolean | number = false;
  function appendError({
    field: { value, ...rest },
    error,
  }: {
    field: PropsField;
    error: string;
  }): PropsField {
    return {
      ...rest,
      error: { state: true, message: error },
      changed: true,
      value: value,
    };
  }
  return {
    steps: steps.map((obj, key) => {
      let { fields, ...rest } = obj;
      if (fields) {
        fields.forEach((field, key) => {
          const { serverError = field.name } = field;
          if (Array.isArray(serverError)) {
            serverError.forEach(element => {
              try {
                if (element in errors) {
                  if (!errorStep) {
                    errorStep = key;
                  }
                  fields[key] = appendError({
                    field,
                    error: errors[element],
                  });
                }
              } catch (error) {
                console.error(error);
              }
            });
          } else {
            try {
              if (serverError in errors) {
                if (!errorStep) {
                  errorStep = key;
                }
                fields[key] = appendError({
                  field,
                  error: errors[serverError],
                });
              }
            } catch (error) {
              console.error(error);
            }
          }
          return null;
        });
        return { ...rest, fields };
      }
      return obj;
    }),
    activeStep: !errorStep ? 0 : errorStep,
  };
};

export { inputsValidate, showErrorValidations };
