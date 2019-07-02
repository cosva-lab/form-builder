import PropTypes from 'prop-types';
import produce from 'immer';
import {
  PropsField,
  InitialStateSteps,
  FieldsRenderProps,
  ChangeValueFields,
  InitialStateFields,
  ChangeValueSteps,
  Fields,
} from '../../index';

const changeValueField = ({
  field,
  action,
}: {
  field: PropsField;
  action: any;
}): PropsField => {
  return {
    ...field,
    value: action.value,
    error: { state: false, message: '' },
    changed: true,
  };
};

const changeValueFields: (props: ChangeValueFields) => Fields = ({
  fields,
  action,
}) =>
  produce<Fields, Fields>(
    fields,
    (draft): void => {
      const { name } = action;
      if (Array.isArray(draft)) {
        const index = draft.map(({ name }) => name).indexOf(name);
        let field = changeValueField({
          field: draft[index],
          action,
        });
        draft[index] = field;
      } else {
        let field = changeValueField({
          field: draft[name],
          action,
        });
        draft[name] = field;
      }
    },
  );

const changeValueSteps = ({
  activeStep,
  steps,
  action,
}: ChangeValueSteps) => {
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
  produce<FieldsRenderProps, FieldsRenderProps>(
    fieldsRender,
    data => {
      if (Array.isArray(data.fields)) {
        for (let i in data.fields) {
          data.fields[i] = renderField(data.fields[i]);
        }
      }
    },
  );
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
