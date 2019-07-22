import React from 'react';
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
} from '../../MessagesTranslate/Animation';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { InputProps } from '..';
import { transformLabel } from '../utils/transformLabel';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    formControl: {},
    widthNormal: { width: '100%' },
    InputLabelProps: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  });

interface AllProps extends InputProps, WithStyles<typeof styles> {}

class Input extends React.PureComponent<AllProps> {
  static defaultProps: Partial<AllProps> = {
    type: 'text',
    error: {
      ns: 'validations',
      props: {},
      state: false,
      message: '',
    },
    fullWidth: true,
    autoComplete: '',
    InputProps: {},
  };

  animation = true;
  lastValue = '';

  componentDidUpdate({ error }: InputProps) {
    if (error && error.state) {
      this.animation = true;
    }
  }

  public render() {
    const {
      ns,
      classes,
      error,
      changeField,
      sendChange,
      label,
      name,
      type,
      value,
      InputProps,
      fullWidth,
      disabled,
      autoComplete,
    } = this.props;
    return (
      <FormControl
        {...{ fullWidth }}
        className={classes.formControl}
        variant="outlined"
      >
        <TextField
          onBlur={() => {
            sendChange && sendChange();
          }}
          label={getMessage(transformLabel({ label, ns, name }))}
          error={error && error.state}
          FormHelperTextProps={{
            component: ({ children, className }) => {
              const child = (
                <div className={className}>{children}</div>
              );
              if (
                this.animation &&
                this.props.error &&
                this.props.error.state
              ) {
                this.animation = false;
                return <Animation>{child}</Animation>;
              }
              return child;
            },
            style: {},
          }}
          helperText={getMessage(error || { message: '' })}
          InputProps={InputProps}
          InputLabelProps={{
            shrink: this.props.type === 'date' ? true : undefined,
            classes: {
              root: classNames(
                classes.InputLabelProps,
                classes.widthNormal,
              ),
            },
          }}
          onChange={({ target: { value: targetValue } }) => {
            const { length } = targetValue;
            const { length: lastLength } = this.lastValue;
            changeField({
              target: { name, value: targetValue, type },
              waitTime: !(
                lastLength - 1 !== length && lastLength + 1 !== length
              ),
            });
            this.lastValue = targetValue;
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              sendChange && sendChange();
            }
          }}
          {...{
            name,
            type,
            value,
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
