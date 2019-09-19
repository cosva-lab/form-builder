import React from 'react';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { observer } from 'mobx-react';
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
    formHelperTextPropsRoot: {
      wordBreak: 'break-word',
    },
  });

interface AllProps extends InputProps, WithStyles<typeof styles> {}

@observer
class Input extends React.PureComponent<
  AllProps,
  { type: InputProps['type'] }
> {
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
    inputProps: () => {
      return {};
    },
  };

  constructor(props: AllProps) {
    super(props);
    this.state = { type: props.type };
  }

  animation = true;
  lastValue = '';

  UNSAFE_componentWillUpdate({ error }: InputProps) {
    if (
      this.props.error &&
      error &&
      error.state !== this.props.error.state
    ) {
      this.animation = true;
    }
  }

  public render() {
    const {
      ns,
      classes,
      changeField,
      label,
      fieldProxy,
    } = this.props;
    const {
      name,
      value,
      disabled,
      fullWidth,
      error,
      autoComplete,
      inputProps,
    } = { ...this.props, ...fieldProxy };
    const { type } = this.state;
    return (
      <FormControl
        {...{ fullWidth }}
        className={classes.formControl}
        variant="outlined"
      >
        <TextField
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
            classes: { root: classes.formHelperTextPropsRoot },
          }}
          helperText={getMessage(error || { message: '' })}
          InputProps={
            inputProps &&
            inputProps({
              type,
              changeType: (type, callback) => {
                if (type !== this.state.type)
                  this.setState({ type }, callback);
              },
            })
          }
          InputLabelProps={{
            shrink: type === 'date' ? true : undefined,
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
