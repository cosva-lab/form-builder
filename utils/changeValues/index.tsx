import PropTypes from 'prop-types';
import produce from 'immer';
import {
  PropsField,
  InitialStateSteps,
  FieldsRenderProps,
} from '../../index';

const changeValueField = ({ field, action }: any): PropsField => ({
  ...field,
  value: action.value,
  error: { state: false, message: '' },
  changed: true,
});

const changeValueFields = ({
  fields,
  action,
}: {
  fields: PropsField[];
  action: any;
}): PropsField[] =>
  produce(
    fields,
    (draft): void => {
      const index = draft
        .map(({ name }) => name)
        .indexOf(action.name);
      draft[index] = changeValueField({
        field: draft[index],
        action,
      });
    },
  );

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

const renderFields = (
  fieldsRender: FieldsRenderProps,
): FieldsRenderProps =>
  produce(fieldsRender, data => {
    for (let i in data.fields) {
      data.fields[i] = renderField(data.fields[i]);
    }
  });
const renderStateSteps = (initialState: InitialStateSteps) =>
  produce(initialState, (draft: InitialStateSteps) => {
    if (!draft.activeStep) draft.activeStep = 0;
    draft.steps = draft.steps.map(({ label, ...rest }) => ({
      label,
      ...renderFields(rest),
    }));
  });

export {
  changeValueSteps,
  changeValueField,
  changeValueFields,
  renderStateSteps,
  renderField,
  renderFields,
};
