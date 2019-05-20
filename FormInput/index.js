import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '../Input';
import AutoComplete from './autoComplete';
import DropdownList from '../../DropdownList/DropdownList';
import File from './File';
import ListSwitch from './listSwitch';
import Chips from './Chips';
/* import BoxForm from '../Table/BoxForm'; */

class FormInput extends React.PureComponent {
  render() {
    const {
      actionsExtra,
      multiple,
      InputProps,
      label,
      helpMessage,
      handleChange,
      type,
      value,
      name,
      route,
      searchId,
      search,
      error,
      validateField,
      waitTime,
      renderItem,
      component,
      disabled,
      extensions,
      actions,
      validation,
      extraProps,
      ns,
      ...propsRest
    } = this.props;
    const { state, message } = error;
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
              waitTime,
              InputProps,
              label,
              name,
              value,
              type,
              error,
              disabled,
              handleChange,
            }}
          />
        );
      case 'file':
        return (
          <File
            {...{
              ns,
              validateField,
              multiple,
              waitTime,
              InputProps,
              label,
              name,
              value,
              type,
              error,
              disabled,
              handleChange,
              extensions,
              extraProps,
            }}
          />
        );
      case 'listSwitch':
        return (
          <ListSwitch
            {...{
              ns,
              validateField,
              multiple,
              waitTime,
              InputProps,
              label,
              name,
              value,
              type,
              error,
              disabled,
              handleChange,
              extensions,
            }}
          />
        );
      case 'list':
        return (
          <DropdownList
            search={search}
            searchId={searchId}
            fullWidth
            route={route}
            helpMessage={helpMessage}
            renderItem={renderItem}
            defaultValue={value}
            value={value}
            error={state}
            message={message}
            onChange={handleChange}
            disabled={disabled}
            {...{ ns, ...propsRest, label, name }}
          />
        );
      case 'autoComplete':
        return (
          <AutoComplete
            {...{
              ns,
              extraProps,
              waitTime,
              InputProps,
              label,
              name,
              value,
              type,
              error,
              disabled,
              handleChange,
            }}
          />
        );
      case 'table':
        return null;
      /* return (
          <BoxForm
            value={value}
            {...{ns, ...propsRest, label, name }}
            onChange={handleChange}
          />
        ); */
      case 'chips':
        return (
          <Chips
            {...{
              ns,
              waitTime,
              actions,
              InputProps,
              label,
              name,
              value,
              type,
              error,
              disabled,
              handleChange,
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
                  handleChange({
                    target: { name, checked, type },
                  });
                }}
                name={name}
                {...propsRest}
                disabled={disabled}
              />
            }
            label={label}
          />
        );
      case 'component':
        if (React.isValidElement(component)) {
          return React.cloneElement(component, {
            ...this.props,
          });
        }
        if (typeof component === 'function') {
          return React.createElement(component, {
            ...this.props,
          });
        }
        return null;
      default:
        return null;
    }
  }
}

FormInput.propTypes = {
  helpMessage: PropTypes.bool,
  InputProps: PropTypes.object,
  extraProps: PropTypes.object,
  actions: PropTypes.object,
  props: PropTypes.object,
  validation: PropTypes.array,
  type: PropTypes.oneOf([
    'time',
    'text',
    'file',
    'number',
    'email',
    'date',
    'password',
    'list',
    'table',
    'autoComplete',
    'chips',
    'checkbox',
    'component',
    'listSwitch',
  ]),
  handleChange: PropTypes.func,
  actionsExtra: PropTypes.object,
  validateField: PropTypes.func,
  error: PropTypes.shape({
    state: PropTypes.bool,
    message: PropTypes.string,
  }),
  ns: PropTypes.string,
  transPosition: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  search: PropTypes.shape({
    state: PropTypes.bool,
    value: PropTypes.number,
  }),
  extensions: PropTypes.array,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),
  route: PropTypes.string,
  waitTime: PropTypes.bool,
  searchId: PropTypes.string,
};

FormInput.defaultProps = {
  type: 'text',
  disabled: false,
  multiple: true,
  helpMessage: true,
  waitTime: true,
  InputProps: {},
  extraProps: {},
  route: '',
};

export default compose()(FormInput);
