import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
  Input,
  AutoComplete,
  DropdownList,
  FileInput,
  ListSwitch,
  Chips,
} from './inputsTypes';
import { FormInputProps } from './types';
import { transformLabel } from './utils';

const Inputs = (props: FormInputProps) => {
  const {
    multiple,
    inputProps,
    label,
    changeField,
    type,
    value,
    name,
    error,
    disabled,
    extraProps,
    ns,
    fullWidth,
    autoComplete,
    fieldProxy,
  } = props;
  switch (type) {
    case 'text':
    case 'number':
    case 'email':
    case 'password':
    case 'time':
    case 'date':
      return (
        <Input
          {...{
            ns,
            inputProps,
            label: transformLabel({ label, ns, name }),
            name,
            value,
            type,
            error,
            disabled,
            changeField,
            fullWidth,
            autoComplete,
            fieldProxy,
          }}
        />
      );
    case 'file':
      let onAdd;
      let onDelete;
      let onSort;
      let sort;
      let arrayMove;
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
            ns,
            multiple,
            inputProps,
            label: transformLabel({ label, ns, name }),
            name,
            value,
            type,
            error,
            disabled,
            changeField,
            extraProps,
            onAdd,
            onDelete,
            onSort,
            sort,
            arrayMove,
            fieldProxy,
          }}
        />
      );
    case 'listSwitch':
      return (
        <ListSwitch
          {...{
            ns,
            multiple,
            inputProps,
            label: transformLabel({ label, ns, name }),
            name,
            value,
            type,
            error,
            disabled,
            changeField,
          }}
        />
      );
    case 'list':
      return (
        <DropdownList
          fullWidth={true}
          value={value}
          error={error}
          onChange={changeField}
          disabled={disabled}
          ns={ns}
          label={transformLabel({ label, ns, name })}
          name={name}
          extraProps={extraProps}
        />
      );
    case 'autoComplete':
      return (
        <AutoComplete
          {...{
            ns,
            extraProps,
            label: transformLabel({ label, ns, name }),
            name,
            value,
            type,
            error,
            disabled,
            changeField,
          }}
        />
      );
    case 'table':
      return null;
    /* return (
          <BoxForm
            value={value}
            {...{ns, ...propsRest, label, name }}
            onChange={changeField}
          />
        ); */
    case 'chips':
      return (
        <Chips
          {...{
            ns,
            inputProps,
            label: transformLabel({ label, ns, name }),
            name,
            value,
            type,
            error,
            disabled,
            changeField,
          }}
        />
      );
    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={e => {
                const { target } = e;
                const { name, checked, type } = target;
                changeField({
                  target: { name, value: checked, type },
                });
              }}
              name={name}
              disabled={disabled}
            />
          }
          label={transformLabel({ label, ns, name })}
        />
      );
    default:
      return null;
  }
};

Inputs.defaultProps = {
  type: 'text',
  disabled: false,
  multiple: true,
  extraProps: {},
  route: '',
};

export { Inputs };
export default Inputs;
