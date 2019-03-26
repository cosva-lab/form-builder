import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {
  Animation,
  getMessage,
} from '../MessagesTranslate/Animation';

class Input extends React.PureComponent {
  animation = true;

  componentDidUpdate(newProps) {
    const { state } = newProps.error;
    const { state: stateProps } = this.props.error;
    if (stateProps !== state) {
      this.animation = true;
    }
  }

  render() {
    const {
      classes,
      error,
      handleChange,
      label,
      name,
      type,
      value,
      InputProps,
      waitTime,
      ...rest
    } = this.props;
    const { state, message, ns, attribute } = error;
    return (
      <FormControl fullWidth>
        <TextField
          onBlur={() => {
            this.animation = false;
            handleChange({
              target: { name, value, type },
              waitTime: false,
            });
          }}
          label={label}
          name={name}
          type={type}
          error={state}
          FormHelperTextProps={{
            component: ({ children, className }) => {
              const child = (
                <div className={className}>{children}</div>
              );
              if (this.animation) {
                this.animation = false;
                return <Animation>{child}</Animation>;
              }
              return child;
            },
          }}
          helperText={getMessage(message, ns, attribute)}
          InputProps={InputProps}
          onChange={({ target }) => {
            const { value: targetValue } = target;
            handleChange({
              target: { name, value: targetValue, type },
              waitTime,
            });
          }}
          {...rest}
        />
      </FormControl>
    );
  }
}

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text',
    'number',
    'email',
    'date',
    'password',
  ]),
  autoComplete: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.object,
  InputProps: PropTypes.object,
  waitTime: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: 'text',
  error: {
    ns: 'validations',
    attribute: '',
    state: false,
    message: '',
  },
  waitTime: true,
  autoComplete: '',
  InputProps: {},
};

// eslint-disable-next-line react/no-multi-comp
class InputSwitch extends React.PureComponent {
  render() {
    const { type } = this.props;
    if (type === 'date') {
      return (
        <Input InputLabelProps={{ shrink: true }} {...this.props} />
      );
    }
    return <Input {...this.props} />;
  }
}

/* export default props => (
  <Suspense fallback={<Loading />}>
    {React.createElement(
      compose(
        withStyles(styles, { name: 'Input' }),
        withTranslation(),
      )(InputSwitch),
      props,
    )}
  </Suspense>
); */

export default compose(withStyles(styles, { name: 'Input' }))(
  InputSwitch,
);
