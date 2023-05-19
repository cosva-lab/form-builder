import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { intercept } from 'mobx';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import { isEmpty } from '../../utils/isEmpty';
import { TransformLabel } from '../../utils/TransformLabel';
import { RenderErrorsDefault } from '../../RenderErrorsDefault';
import type {
  ValidationErrors,
  NameField,
  value,
  TypeTextField,
  FieldProps,
  LabelPropsField,
} from '../../types';
import classes from './Input.module.scss';

export interface InputProps<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> extends FieldProps<V, Name, Label> {
  type?: TypeTextField;
}

@observer
export class Input<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> extends React.Component<
  InputProps<V, Name, Label>,
  { type?: TypeTextField }
> {
  constructor(props: InputProps<V, Name, Label>) {
    super(props);
    this.state = { type: props.type };
  }

  errors: ValidationErrors = [];

  animation = true;

  componentDidMount() {
    const { field } = this.props;
    intercept(field, 'errors', (change) => {
      this.animation = true;
      return change;
    });
  }

  getProps = (props: InputProps<V, Name, Label>) => ({
    ...props.field,
  });

  getLastProps = () => this.getProps(this.props);

  public render() {
    const { onChangeField, field } = this.props;
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
    } = field;

    const { type } = this.state;
    const errorsNode =
      errors &&
      ((RenderErrors && <RenderErrors {...{ errors, field }} />) || (
        <RenderErrorsDefault<V, Name, Label> {...{ errors, field }} />
      ));
    return (
      <FormControl
        {...{ fullWidth }}
        className={classes.formControl}
        variant="outlined"
      >
        <TextField
          label={<TransformLabel {...{ label, ns, name }} />}
          inputRef={(element) => (field.inputRef = element)}
          error={!isEmpty(errors)}
          InputProps={
            typeof InputProps === 'function'
              ? InputProps({
                  type,
                  field,
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
          onChange={(e) => {
            const onChange = field.onChange;
            const value = e.target.value as V;
            if (onChange)
              onChange({ name: field.name, value, field }, e);
            else field.setValue(value);
          }}
          onBlur={() => {
            const { field } = this.props;
            field && field.markAsTouched();
          }}
          name={name.toString()}
          {...{
            ...textFieldProps,
            type,
            value,
            disabled,
            autoComplete,
          }}
        />
        {errorsNode && (
          <FormHelperText
            component="div"
            error
            className={classes.formHelperTextPropsRoot}
          >
            {errorsNode}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
}

export default Input;
