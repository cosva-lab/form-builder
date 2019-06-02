import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classNames from 'classnames';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {
  Animation,
  getMessage,
} from '../MessagesTranslate/Animation';
import { InputProps } from '.';
import { createStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
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

interface AllProps extends InputProps, WithStyles<typeof styles> {}

class Input extends React.PureComponent<AllProps, { blur: boolean }> {
  static defaultProps: Partial<AllProps> = {
    type: 'text',
    error: {
      ns: 'validations',
      props: {},
      state: false,
      message: '',
    },
    waitTime: true,
    fullWidth: true,
    autoComplete: '',
    InputProps: {},
  };

  state = {
    blur: this.props.type !== 'date',
  };

  animation = true;

  componentDidUpdate({ error }: InputProps) {
    if (this.props.error!.state !== error!.state) {
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
          helperText={getMessage({ message: message, ns, props })}
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

export default compose<AllProps, {}>(
  withStyles(styles, { name: 'Input' }),
)(Input);
