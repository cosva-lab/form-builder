import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '../Input';
import DropdownList from '../../DropdownList/DropdownList';
/* import BoxForm from '../../Forms/Table/BoxForm'; */

const styles = theme => ({
  input: {
    marginBottom: theme.spacing.unit * 1,
  },
});

class FormInput extends React.PureComponent {
  render() {
    const {
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
      waitTime,
      renderItem,
      disabled,
      classes,
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
        return <div>34234</div>;
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
      case 'render':
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
      default:
        return null;
    }
  }
}

FormInput.propTypes = {
  helpMessage: PropTypes.bool,
  InputProps: PropTypes.object,
  type: PropTypes.oneOf([
    'time',
    'text',
    'number',
    'email',
    'date',
    'password',
    'list',
    'table',
    'checkbox',
    'render',
  ]),
  handleChange: PropTypes.func,
  error: PropTypes.shape({
    state: PropTypes.bool,
    message: PropTypes.string,
  }),
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  ns: PropTypes.string,
  transPosition: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  search: PropTypes.shape({
    state: PropTypes.bool,
    value: PropTypes.number,
  }),
  classes: PropTypes.shape({ input: PropTypes.string }),
  disabled: PropTypes.bool,
  route: PropTypes.string,
  waitTime: PropTypes.bool,
  searchId: PropTypes.string,
};

FormInput.defaultProps = {
  type: 'text',
  disabled: false,
  helpMessage: true,
  waitTime: true,
  InputProps: {},
  route: '',
};

export default compose(withStyles(styles, { name: 'formInput' }))(
  FormInput,
);
