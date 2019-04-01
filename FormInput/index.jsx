import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '../Input';
import DropdownList from '../../DropdownList/DropdownList';
import File from './File';
import ListSwitch from './listSwitch';
import Chips from './Chips';
/* import BoxForm from '../Table/BoxForm'; */

const styles = theme => ({
  input: {
    marginBottom: theme.spacing.unit * 0,
  },
});

class FormInput extends React.PureComponent {
  render() {
    const {
      multiple,
      InputProps,
      label,
      subLabel,
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
      classes,
      accept,
      extensions,
      actions,
      validation,
      validateExtensions,
      validateAccept,
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
            className={classes.input}
            {...{
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
              validateField,
              multiple,
              waitTime,
              InputProps,
              label,
              subLabel,
              name,
              value,
              type,
              error,
              disabled,
              handleChange,
              accept,
              extensions,
              validateExtensions,
              validateAccept,
            }}
          />
        );
      case 'listSwitch':
        return (
          <ListSwitch
            {...{
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
              accept,
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
            {...{ ...propsRest, label, name }}
          />
        );
      case 'table':
        return null;
      /* return (
          <BoxForm
            value={value}
            {...{ ...propsRest, label, name }}
            onChange={handleChange}
          />
        ); */
      case 'chips':
        return (
          <Chips
            {...{
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
          return component;
        }
        if (typeof component === 'function') {
          return React.createElement(component, {
            waitTime,
            InputProps,
            label,
            name,
            value,
            type,
            error,
            validation,
            disabled,
            handleChange,
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
  actions: PropTypes.object,
  validation: PropTypes.array.isRequired,
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
    'chips',
    'checkbox',
    'component',
    'listSwitch',
  ]),
  handleChange: PropTypes.func,
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  search: PropTypes.shape({
    state: PropTypes.bool,
    value: PropTypes.number,
  }),
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  extensions: PropTypes.array,
  validateExtensions: PropTypes.bool,
  validateAccept: PropTypes.bool,
  classes: PropTypes.shape({ input: PropTypes.string }),
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
  route: '',
};

export default compose(withStyles(styles, { name: 'formInput' }))(
  FormInput,
);
