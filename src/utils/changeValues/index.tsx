import PropTypes from 'prop-types';
import { observable } from 'mobx';
import {
  PropsField,
  ChangeValueFields,
  ChangeValueSteps,
  ChangeValueField,
} from '../../types';

function changeValueField({
  field,
  action,
}: ChangeValueField): PropsField {
  field.value = action.value;
  if (field.error) {
    if (field.error.state) field.error.state = false;
    if (field.error.message) field.error.message = '';
  } else {
    field.error = observable({ state: false, message: '' });
  }
  if (!field.changed) field.changed = true;
  if (field.validations)
    field.haveErrors().then(error => (field.error = error));

  return field;
}

const changeValueFields: (props: ChangeValueFields) => void = ({
  fieldsBuilder,
  action,
}) => {
  const { fields } = fieldsBuilder;
  const index = fields.findIndex(({ name }) => name === action.name);
  if (index !== -1)
    changeValueField({ field: fields[index], action });
};

function changeValueSteps({
  activeStep,
  steps,
  action,
}: ChangeValueSteps): void {
  changeValueFields({
    action,
    fieldsBuilder: steps[activeStep],
  });
}

changeValueSteps.propTypes = {
  activeStep: PropTypes.number.isRequired,
  steps: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};

export { changeValueSteps, changeValueField, changeValueFields };
