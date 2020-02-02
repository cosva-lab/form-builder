import React from 'react';
import compose from 'recompose/compose';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Animation, getMessage } from '../FieldTranslate';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import isEmpty from 'lodash/isEmpty';

import { InputProps } from '..';
import { transformLabel } from '../utils/transformLabel';
import { RenderErrorsDefault } from './RenderErrorsDefault';

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
class InputComponent extends React.Component<
  AllProps,
  { type: InputProps['type'] }
> {
  constructor(props: AllProps) {
    super(props);
    this.state = { type: props.type };
  }

  animation = true;
  lastValue = '';

  UNSAFE_componentWillUpdate(newProps: AllProps) {
    const { errors } = this.getProps(newProps);
    const props = this.getLastProps();
    if (props.errors && errors !== props.errors) {
      this.animation = true;
    }
  }

  getProps = (props: AllProps) => ({ ...props.fieldProxy });

  getLastProps = () => this.getProps(this.props);

  public render() {
    const { classes, changeField, fieldProxy } = this.props;
    const {
      ns,
      label,
      name,
      disabled,
      fullWidth = true,
      errors,
      autoComplete,
      inputProps,
      textFieldProps,
      value,
      renderErrors: RenderErrors,
    } = fieldProxy;

    const { type } = this.state;
    return (
      <FormControl
        {...{ fullWidth }}
        className={classes.formControl}
        variant="outlined"
      >
        <TextField
          label={getMessage(transformLabel({ label, ns, name }))}
          error={!isEmpty(errors)}
          FormHelperTextProps={{
            component: ({ children, className }) => {
              const child = (
                <div className={className}>{children}</div>
              );
              if (this.animation && !isEmpty(errors)) {
                this.animation = false;
                return <Animation>{child}</Animation>;
              }
              return child;
            },
            style: {},
            classes: { root: classes.formHelperTextPropsRoot },
          }}
          helperText={
            errors &&
            ((RenderErrors && <RenderErrors {...{ errors }} />) || (
              <RenderErrorsDefault {...{ errors }} />
            ))
          }
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
              root: clsx(
                classes.InputLabelProps,
                classes.widthNormal,
              ),
            },
          }}
          onChange={({ target: { value: targetValue } }) => {
            changeField({
              target: { name, value: targetValue, type },
            });
            this.lastValue = targetValue;
          }}
          onBlur={() => {
            const { fieldProxy } = this.props;
            fieldProxy && fieldProxy.markAsTouched();
          }}
          {...{
            ...textFieldProps,
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

export const Input = compose<AllProps, InputProps>(
  withStyles(styles, { name: 'Input' }),
)(InputComponent);

export default Input;
