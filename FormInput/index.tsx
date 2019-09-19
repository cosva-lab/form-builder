import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from './Input';
import AutoComplete from './autoComplete';
import DropdownList from '../../DropdownList/DropdownList';
import FileInput from './FileInput';
import ListSwitch from './listSwitch';
import Chips from './Chips';
import { FormInputProps } from '..';
import { transformLabel } from '../utils/transformLabel';

class FormInput extends React.PureComponent<FormInputProps> {
  static defaultProps = {
    type: 'text',
    disabled: false,
    multiple: true,
    extraProps: {},
    route: '',
  };

  public render() {
    const {
      multiple,
      inputProps,
      label,
      changeField,
      type,
      value,
      name,
      error,
      validateField,
      disabled,
      extraProps,
      ns,
      fullWidth,
      autoComplete,
      fieldProxy,
    } = this.props;
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
              validateField,
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
  }
}

export default FormInput;
