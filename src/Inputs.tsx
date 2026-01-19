import React from 'react';
import { Input } from './inputsTypes';
import type { FieldProps, PropsField } from './types';

function Inputs<Field extends PropsField>(
  props: FieldProps<
    Field['value'],
    Field['name'],
    Field['validations']
  >,
) {
  const { field } = props;
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
      return <Input {...{ field, type }} />;
    default:
      return null;
  }
}

export { Inputs };
export default Inputs;
