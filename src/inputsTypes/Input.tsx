import React from 'react';
import compose from 'recompose/compose';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import assign from 'lodash/assign';

import { InputProps } from '..';
import { Animation } from '../FieldTranslate';
import { TransformLabel } from '../utils/TransformLabel';
import { RenderErrorsDefault } from '../RenderErrorsDefault';
import { ValidationErrors } from '../types';

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
  callbacks: Function[] = [];
  errors: ValidationErrors = [];

  animation = true;

  UNSAFE_componentWillUpdate(newProps: AllProps) {
    const { errors } = this.getProps(newProps);
    if (!isEqual(toJS(errors), this.errors)) {
      this.animation = true;
    }
  }

  componentDidUpdate() {
    const { fieldProxy } = this.props;
    this.callbacks.forEach(callback => callback());
    this.callbacks = [];
    this.errors = toJS(fieldProxy.errors || []);
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
      InputProps,
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
          label={<TransformLabel {...{ label, ns, name }} />}
          inputRef={element => (fieldProxy.inputRef = element)}
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
            ((RenderErrors && (
              <RenderErrors {...{ errors, fieldProxy }} />
            )) || <RenderErrorsDefault {...{ errors, fieldProxy }} />)
          }
          InputProps={
            typeof InputProps === 'function'
              ? InputProps({
                  type,
                  fieldProxy,
                  changeType: (type, callback) => {
                    if (type !== this.state.type)
                      this.setState({ type }, callback);
                  },
                })
              : InputProps
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
          onChange={e => {
            const onChange = fieldProxy.onChange || changeField;
            if (onChange) {
              const callback = onChange(assign(e, { fieldProxy }));
              typeof callback === 'function' &&
                this.callbacks.push(callback);
            } else {
              fieldProxy.setValue(e.target.value);
            }
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
