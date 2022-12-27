import React from 'react';
import { Input } from './inputsTypes';
import type { FieldProps } from './types';

const Inputs = (props: FieldProps) => {
  const { changeField, field } = props;
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
      return <Input {...{ field, changeField, type }} />;
    default:
      return null;
  }
};

Inputs.defaultProps = {
  disabled: false,
  multiple: true,
  extraProps: {},
  route: '',
};
console.log(Inputs);

export { Inputs };
export default Inputs;
