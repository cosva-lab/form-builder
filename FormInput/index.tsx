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
/* import BoxForm from '../Table/BoxForm'; */

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
      InputProps,
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
              InputProps,
              label: transformLabel({ label, ns, name }),
              name,
              value,
              type,
              error,
              disabled,
              changeField,
              fullWidth,
              autoComplete,
            }}
          />
        );
      case 'file':
        let onAdd;
        let onDelete;
        if (extraProps) {
          onAdd = extraProps.onAdd;
          onDelete = extraProps.onDelete;
        }
        return (
          <FileInput
            {...{
              ns,
              validateField,
              multiple,
              InputProps,
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
            }}
          />
        );
      case 'listSwitch':
        return (
          <ListSwitch
            {...{
              ns,
              multiple,
              InputProps,
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
              InputProps,
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
              InputProps,
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
