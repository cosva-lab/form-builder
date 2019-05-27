import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {
  Animation,
  getMessage,
} from '../MessagesTranslate/Animation';

class Input extends React.PureComponent {
  state = {
    blur: this.props.type !== 'date',
  };

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
      fullWidth,
      className,
      disabled,
      autoComplete,
      ...rest
    } = this.props;
    const { state, message, ns, props } = error;
    const { blur } = this.state;
    return (
      <FormControl
        {...{ fullWidth }}
        className={classes.formControl}
        variant="outlined"
        onFocus={() => {
          if (!value) {
            setTimeout(() => {
              this.setState({ blur: false });
            }, 100);
          }
        }}
        onBlur={() => {
          if (!value) {
            this.setState({ blur: true });
          }
        }}
      >
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
            style: {},
          }}
          helperText={getMessage({ label: message, ns, props })}
          InputProps={InputProps}
          InputLabelProps={{
            shrink: this.props.type === 'date' ? true : undefined,
            FormLabelClasses: {
              root: classNames(classes.InputLabelProps, {
                [classes.widthFull]: !blur,
                [classes.widthNormal]: blur,
              }),
            },
          }}
          onChange={({ target }) => {
            const { value: targetValue } = target;
            handleChange({
              target: { name, value: targetValue, type },
              waitTime,
            });
          }}
          value={value}
          {...{
            className,
            disabled,
            autoComplete,
          }}
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
  formControl: {},
  widthFull: { width: '133%' },
  widthNormal: { width: '100%' },
  InputLabelProps: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

Input.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
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
  fullWidth: PropTypes.bool,
  classes: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: 'text',
  error: {
    ns: 'validations',
    props: '',
    state: false,
    message: '',
  },
  waitTime: true,
  fullWidth: true,
  autoComplete: '',
  InputProps: {},
};

export default compose(withStyles(styles, { name: 'Input' }))(Input);
