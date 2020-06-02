import React from 'react';
import { Input, FileInput } from './inputsTypes';
import { FieldProps } from './types';

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
    case 'file':
      const { onAdd, onDelete, onSort, sort, arrayMove, multiple } = {
        ...field.extraProps,
      };
      return (
        <FileInput
          {...{
            multiple,
            changeField,
            onAdd,
            onDelete,
            onSort,
            sort,
            arrayMove,
            field,
          }}
        />
      );
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

export { Inputs };
export default Inputs;
