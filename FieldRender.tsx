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
  changeField,
  ChangeField,
  Validation,
} from './';
import { transformLabel } from './utils/transformLabel';

declare type States = Validations & {
  value: any;
  error?: Message | undefined;
};
export default class FieldRender
  extends React.Component<FormBuilder.FieldRender, States>
  implements ChangeField {
  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    sm: 12,
    search: {
      state: false,
      value: -1,
    },
  };

  public errorFlag: Message | undefined;

  constructor(props: FormBuilder.FieldRender) {
    super(props);
    const {
      value,
      changed,
      validChange = false,
      validate,
      validations,
      error,
    } = props;

    if (!(error && error.state)) {
      this.verifyError({
        validations,
        value,
        validChange,
        changed,
        validate,
      }).then(error => {
        if (error) this.setState({ error });
      });
    }

    this.state = {
      error: error && error.state ? error : undefined,
      validate: validate || false,
      validations,
      value: value || '',
      changed: changed || false,
      validChange: validChange || false,
    };
  }

  async componentWillReceiveProps({
    value,
    changed,
    validChange = false,
    validate,
    validations,
    error,
  }: FormBuilder.FieldRender) {
    const message = await this.verifyError({
      validations,
      value,
      validChange,
      changed,
      validate,
    });
    this.setState({
      value,
      validChange,
      validate,
      error: error && error.state ? error : message,
    });
  }

  changeField: changeField = async (
    { target, waitTime = false },
    callback,
  ) => {
    const { validations } = this.props;
    const { validChange, validate } = this.state;
    const { value } = target;
    const message = await this.verifyError({
      validations,
      value,
      validChange,
      changed: true,
      validate,
    });
    this.setState(
      {
        value,
        error: message,
      },
      () => {
        callback && callback();
        if (!waitTime) {
          this.props.changeField({ target });
        }
      },
    );
  };

  sendChange = () => {
    const { name } = this.props;
    const { value } = this.state;
    this.props.changeField({
      target: { value, name },
    });
  };

  validateField = async () => {
    const { validations } = this.props;
    const { validChange, validate, value } = this.state;
    const error = await this.verifyError({
      validations,
      value,
      validChange,
      changed: true,
      validate,
    });

    this.setState({
      error,
    });
  };

  verifyError = ({
    validations = [],
    value,
    validChange,
    changed,
    validate,
  }: Validate) => {
    const validationsObj: Validation[] = [];
    const { fields, activeStep, steps } = this.props;

    let error;
    validations &&
      validations.some(validation => {
        if (typeof validation === 'object') {
          validationsObj.push(validation);
        } else {
          const temPError = validation({
            fields:
              (this.props.getFields && this.props.getFields()) ||
              fields,
            activeStep,
            steps,
            value,
            validChange,
            changed,
            validate,
          }) || {
            state: false,
            message: '',
          };
          if (temPError.state) {
            error = temPError;
            return true;
          }
        }
        return false;
      });
    if (error) return error;
    return new InputValidator(validationsObj).haveErrors({
      value,
      validChange,
      changed,
      validate,
    });
  };

  public render() {
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
      render,
      ns,
      type,
      component,
      extraProps,
      fields,
      InputProps,
      autoComplete,
    } = this.props;
    if (!state) return null;
    const formInput = (
      <FormInput
        label={transformLabel({ label, ns, name })}
        validateField={this.validateField}
        changeField={this.changeField}
        sendChange={this.sendChange}
        error={error}
        {...{
          name,
          type,
          value,
          actionsExtra,
          ns,
          search,
          component,
          extraProps,
          InputProps,
          autoComplete,
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
          { fields, ...this.props },
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
