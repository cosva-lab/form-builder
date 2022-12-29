import type {
  PropsField,
  ChangeValueFields,
  ChangeValueSteps,
  ChangeValueField,
} from '../../types';

function changeValueField({
  field,
  action,
}: ChangeValueField): PropsField {
  field.setValue(action.value);
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

export { changeValueSteps, changeValueField, changeValueFields };
