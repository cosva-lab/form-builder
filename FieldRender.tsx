import * as React from 'react';
import * as ReactIs from 'react-is';
import Grid from '@material-ui/core/Grid';
import FormInput from './FormInput/index';
import InputValidator from './utils/validate/InputValidator';
import { Message } from '../MessagesTranslate/Animation';
import {
  FormBuilder,
  Validations,
  Validate,
  handleChangeFieldRender,
} from './';
import { transformLabel } from './utils/transformLabel';
export default class FieldRender extends React.Component<
  FormBuilder.FieldRender,
  Validations & {
    value: any;
    error?: Message | undefined;
  }
> {
  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    sm: 12,
    search: {
      state: false,
      value: -1,
    },
    waitTime: true,
  };
  constructor(props: FormBuilder.FieldRender) {
    super(props);
    const {
      value,
      changed,
      validChange = false,
      validate,
      validation,
    } = props;
    this.state = {
      error:
        this.verifyError({
          validation,
          value,
          validChange,
          changed,
          validate,
        }) || undefined,
      validate: validate || false,
      validation: validation || [],
      value: value || '',
      changed: changed || false,
      validChange: validChange || false,
    };
  }
  componentWillReceiveProps(newProps: FormBuilder.FieldRender) {
    this.updateProps(newProps);
  }
  public updateProps({
    value,
    changed,
    validChange = false,
    validate,
    validation,
  }: FormBuilder.FieldRender) {
    this.setState({
      value,
      validChange,
      validate,
      error: this.verifyError({
        validation,
        value,
        validChange,
        changed,
        validate,
      }),
    });
  }
  handleChange: handleChangeFieldRender = ({
    target,
    waitTime = false,
  }) => {
    if (waitTime) {
      const { validation } = this.props;
      const { validChange, validate } = this.state;
      const { value } = target;
      this.setState(
        {
          value,
          error: this.verifyError({
            validation,
            value,
            validChange,
            changed: true,
            validate,
          }),
        },
        () => {
          if (!waitTime) {
            this.sendChange();
          }
        },
      );
    } else {
      this.props.handleChange({ target });
    }
  };
  validateField = () => {
    const { validation } = this.props;
    const { validChange, validate, value } = this.state;
    this.setState({
      error: this.verifyError({
        validation,
        value,
        validChange,
        changed: true,
        validate,
      }),
    });
  };
  sendChange = () => {
    const { value } = this.state;
    const { name } = this.props;
    this.props.handleChange({ target: { value, name } });
  };
  verifyError({
    validation = [],
    value,
    validChange,
    changed,
    validate,
  }: Validate) {
    return new InputValidator(validation).validate({
      value,
      validChange,
      changed,
      validate,
    });
  }
  render() {
    const { value, error } = this.state;
    const { sm } = this.props;
    const { md = sm } = this.props;
    const { lg = md } = this.props;
    const { xs = lg } = this.props;
    const {
      actionsExtra,
      name,
      label,
      search,
      state = true,
      waitTime,
      render,
      ns,
      type,
      component,
      extraProps,
    } = this.props;
    if (!state) return null;
    const formInput = (
      <FormInput
        label={transformLabel({ label, ns, name })}
        validateField={this.validateField}
        handleChange={this.handleChange}
        error={error}
        {...{
          name,
          type,
          value,
          actionsExtra,
          ns,
          search,
          waitTime,
          component,
          extraProps,
        }}
      />
    );
    if (render) {
      return render({
        children: formInput,
        props: this.props,
      });
    }
    if (type === 'component') {
      if (React.isValidElement(component)) {
        return React.cloneElement<FormBuilder.FieldRender>(
          component,
          {
            ...this.props,
          },
        );
      }
      if (
        typeof component === 'function' ||
        ReactIs.isValidElementType(component)
      ) {
        return React.createElement<FormBuilder.FieldRender>(
          component,
          this.props,
        );
      }
      return null;
    }
    return (
      <Grid item sm={sm} md={md} lg={lg} xs={xs}>
        {formInput}
      </Grid>
    );
  }
}
