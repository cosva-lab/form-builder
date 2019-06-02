import PropTypes from 'prop-types';
import produce from 'immer';
import { PropsField, Step, InitialState } from '../../index';

const changeValueField = ({ field, action }: any) => ({
  ...field,
  value: action.value,
  error: { state: false, message: '' },
  changed: true,
});

const changeValueFields = ({ fields, action }: any) =>
  produce(fields, draft => {
    draft[action.name] = changeValueField({
      field: draft[action.name],
      action,
    });
  });

const changeValueSteps = ({ activeStep, steps, action }: any) => {
  const { fields, ...rest } = steps[activeStep];
  const stepsVar = steps;
  stepsVar[activeStep] = {
    ...rest,
    fields: changeValueFields({ action, fields }),
  };
  return [...stepsVar];
};

changeValueSteps.propTypes = {
  activeStep: PropTypes.number.isRequired,
  steps: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};

const renderField = (fieldRender: PropsField) =>
  produce(fieldRender, (field: PropsField) => {
    field.changed = false;
    field.error = { state: false, message: '' };
  });

const renderFields = (fieldsRender: Step) =>
  produce(fieldsRender, (step: Step) => {
    for (let i in step.fields) {
      step.fields[i] = renderField(step.fields[i]);
    }
  });
const renderStateSteps = (initialState: InitialState) =>
  produce(initialState, (draft: InitialState) => {
    if (!draft.activeStep) draft.activeStep = 0;
    draft.steps = draft.steps.map(obj => renderFields(obj));
  });

export {
  changeValueSteps,
  changeValueField,
  changeValueFields,
  renderStateSteps,
  renderField,
  renderFields,
};
