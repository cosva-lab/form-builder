import React from 'react';
import { Input } from './inputsTypes';
import type { FieldProps, LabelPropsField, NameField } from './types';

function Inputs<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
>(props: FieldProps<V, Name, Label>) {
  const { onChangeField, field } = props;
  const { type } = field;
  switch (type) {
    case 'date':
    case 'email':
    case 'number':
    case 'password':
    case 'search':
    case 'tel':
    case 'text':
    case 'time':
    case 'url':
    case 'week':
    case 'datetime-local':
    case undefined:
      return (
        <Input<V, Name, Label> {...{ field, onChangeField, type }} />
      );
    default:
      return null;
  }
}

export { Inputs };
export default Inputs;
