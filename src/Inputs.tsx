import React from 'react';
import { Input, FileInput } from './inputsTypes';
import { FormInputProps } from './types';

const Inputs = (props: FormInputProps) => {
  const { multiple, changeField, fieldProxy } = props;
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
      let onAdd, onDelete, onSort, sort, arrayMove;
      const { extraProps } = fieldProxy;
      if (extraProps) {
        onAdd = extraProps.onAdd;
        onDelete = extraProps.onDelete;
        onSort = extraProps.onSort;
        sort = extraProps.sort;
        arrayMove = extraProps.arrayMove;
      }
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
