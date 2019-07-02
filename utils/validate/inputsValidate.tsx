import InputsValidator from './InputsValidator';
import { Step, InitialStateSteps, PropsField } from '../../index';

const inputsValidate = ({
  activeStep = 0,
  steps,
}: InitialStateSteps) => {
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
        let fieldsRender: PropsField[] = [];
        if (!Array.isArray(fields)) {
          fieldsRender = Object.entries(fields).map(
            ([name, field]) => ({
              name,
              ...field,
            }),
          );
        }
        fieldsRender.forEach((field, key) => {
          const { serverError = field.name } = field;
          if (Array.isArray(serverError)) {
            serverError.forEach(element => {
              try {
                if (element in errors) {
                  if (!errorStep) {
                    errorStep = key;
                  }
                  fieldsRender[key] = appendError({
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
                fieldsRender[key] = appendError({
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
