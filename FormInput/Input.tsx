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
    blur: true,
  };

  animation = true;

  componentDidUpdate({ error }: InputProps) {
    if (this.props.error!.state !== error!.state) {
      this.animation = true;
    }
  }

  public render() {
    const {
      ns,
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
      disabled,
      autoComplete,
    } = this.props;
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
          name={name}
          type={type}
          label={getMessage(transformLabel({ label, ns, name }))}
          error={error!.state}
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
          helperText={getMessage(error || { message: '' })}
          InputProps={InputProps}
          InputLabelProps={{
            shrink: this.props.type === 'date' ? true : undefined,
            classes: {
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
