import React from 'react';
import { Input } from './inputsTypes';
import type { FieldProps, PropsField } from './types';
import FieldBuilder from './utils/builders/FieldBuilder';

function Inputs<Field extends FieldBuilder<any>>(
  props: FieldProps<Field>,
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
