import PropTypes from 'prop-types';
import produce from 'immer';
import {
  PropsField,
  InitialStateSteps,
  FieldsRender,
  ChangeValueFields,
  ChangeValueSteps,
  PropsFieldObject,
  Step,
} from '../../index';
import StepValidator from '../validate/stepValidator';

function changeValueField<Obj = false>({
  field,
  action,
}: {
  field: Obj extends true ? PropsFieldObject : PropsField;
  action: any;
}): Obj extends true ? PropsFieldObject : PropsField {
  return {
    ...field,
    value: action.value,
    error: { state: false, message: '' },
    changed: true,
  };
}

const changeValueFields: (
  props: ChangeValueFields,
) => PropsField[] = ({ fields, action }) =>
  produce<PropsField[], PropsField[]>(fields, (draft): void => {
    const { name } = action;
    const index = draft.map(({ name }) => name).indexOf(name);
    const field = changeValueField({
      field: draft[index],
      action,
    });
    draft[index] = field;
  });

function changeValueSteps({
  activeStep,
  steps,
  action,
}: ChangeValueSteps): StepValidator[] {
  return produce<StepValidator[], StepValidator[]>(
    steps,
    (draft): void => {
      const { fields } = draft[activeStep];
      draft[activeStep].fields = changeValueFields({
        action,
        fields,
      });
    },
  );
}

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

const renderFields = (fieldsRender: FieldsRender): FieldsRender =>
  produce<FieldsRender, FieldsRender>(fieldsRender, data => {
    if (Array.isArray(data.fields)) {
      for (const i in data.fields) {
        if (i) {
          data.fields[i] = renderField(data.fields[i]);
        }
      }
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
