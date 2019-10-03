import PropTypes from 'prop-types';
import { observable } from 'mobx';
import InputValidator from '../validate/InputValidator';
import {
  PropsField,
  ChangeValueFields,
  ChangeValueSteps,
} from '../../';

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
  if (field.validations) {
    const inputValidator = new InputValidator(field);
    inputValidator.haveErrors().then(error => (field.error = error));
  }
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

export { changeValueSteps, changeValueField, changeValueFields };
