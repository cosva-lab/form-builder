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
import type { FieldProps, FieldType, TypeField } from '../../types';
import classes from './Input.module.scss';

export interface InputProps<Field extends FieldType>
  extends FieldProps<
    Field['value'],
    Field['name'],
    Field['validations']
  > {
  type?: TypeField;
}

@observer
export class Input<Field extends FieldType> extends React.Component<
  InputProps<Field>,
  { type?: TypeField }
> {
  constructor(props: InputProps<Field>) {
    super(props);
    this.state = { type: props.type };
  }

  animation = true;

  componentDidMount() {
    const { field } = this.props;
    intercept(field, 'errors', (change) => {
      this.animation = true;
      return change;
    });
  }

  getProps = (props: InputProps<Field>) => ({
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
    } = field;

    const { type } = this.state;
    const errorsNode = Array.isArray(errors) && (
      <RenderErrorsDefault {...{ errors, field }} />
    );
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
                  type: type as TypeField,
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
            const value = e.target.value as Field['value'];
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
