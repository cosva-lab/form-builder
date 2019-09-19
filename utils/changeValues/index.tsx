import PropTypes from 'prop-types';
import produce from 'immer';
import { observable } from 'mobx';
import {
  PropsField,
  InitialStateSteps,
  FieldsRenderProps,
  ChangeValueFields,
  ChangeValueSteps,
} from '../../index';

function changeValueField({
  field,
  action,
}: {
  field: PropsField;
  action: any;
}): PropsField {
  field.value = action.value;
  if (field.error) {
    if (field.error.state) field.error.state = false;
    if (field.error.message) field.error.message = '';
  } else {
    field.error = observable({ state: false, message: '' });
  }
  if (!field.changed) field.changed = true;
  return field;
}

const changeValueFields: (props: ChangeValueFields) => void = ({
  fields,
  action,
}) => {
  const index = fields.findIndex(({ name }) => name === action.name);
  if (index !== -1)
    changeValueField({ field: fields[index], action });
};

function changeValueSteps({
  activeStep,
  steps,
  action,
}: ChangeValueSteps): void {
  const { fields } = steps[activeStep];
  changeValueFields({
    action,
    fields,
  });
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

const renderFields = (
  fieldsRender: FieldsRenderProps,
): FieldsRenderProps =>
  produce<FieldsRenderProps, FieldsRenderProps>(
    fieldsRender,
    data => {
      if (Array.isArray(data.fields)) {
        for (const i in data.fields) {
          if (i) {
            data.fields[i] = renderField(data.fields[i]);
          }
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
