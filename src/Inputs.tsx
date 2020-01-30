import React from 'react';
import { Input, FileInput } from './inputsTypes';
import { FieldProps } from './types';

const Inputs = (props: FieldProps) => {
  const { changeField, fieldProxy } = props;
  const { type } = fieldProxy;
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
    case undefined:
      return <Input {...{ fieldProxy, changeField }} />;
    case 'file':
      const { onAdd, onDelete, onSort, sort, arrayMove, multiple } = {
        ...fieldProxy.extraProps,
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
            fieldProxy,
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
