import React from 'react';
import { Input } from './inputsTypes';
import type { FieldProps, NameField, value } from './types';

function Inputs<V = value, Name extends NameField = string>(
  props: FieldProps<V, Name>,
) {
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
      return <Input<V, Name> {...{ field, onChangeField, type }} />;
    default:
      return null;
  }
}

export { Inputs };
export default Inputs;
