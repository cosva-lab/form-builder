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
  public mount: boolean = false;

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

    this.state = {
      error:
        error && error.state
          ? error
          : {
              state: false,
              message: '',
            },
      validate: validate || false,
      validations,
      value: value || '',
      changed: changed || false,
      validChange: validChange || false,
    };
  }

  componentDidMount() {
    const {
      value,
      changed,
      validChange = false,
      validate,
      validations,
      error,
    } = this.props;
    this.mount = true;

    if (!(error && error.state)) {
      this.verifyError({
        validations,
        value,
        validChange,
        changed,
        validate,
      }).then(error => {
        if (this.mount && error) this.setState({ error });
      });
    }
  }

  componentWillUnmount() {
    this.mount = false;
  }

  async UNSAFE_componentWillReceiveProps({
    value,
    changed,
    validChange = false,
    validate,
    validations,
    error,
  }: FormBuilder.FieldRender) {
    this.setState({
      value,
      validChange,
      validate,
      error,
    });
    const message = await this.verifyError({
      validations,
      value,
      validChange,
      changed,
      validate,
    });
    this.setError(message);
  }

  setError = (message?: Message) => {
    const { error } = this.state;
    if (
      this.mount &&
      message &&
      error &&
      message.state !== error.state
    ) {
      this.setState({
        error: message,
      });
    }
  };

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
    if (this.mount) {
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
    }
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
    const message = await this.verifyError({
      validations,
      value,
      validChange,
      changed: true,
      validate,
    });

    this.setError(message);
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
    const { props } = this;
    const { sm } = props;
    const { md = sm } = props;
    const { lg = md } = props;
    const { xs = lg } = props;
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
      extra,
      fields,
      InputProps,
      autoComplete,
    } = props;
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
          extra,
          InputProps,
          autoComplete,
        }}
      />
    );
    if (render) {
      return render({
        children: formInput,
        props: { fields, ...props },
      });
    }
    if (type === 'component') {
      if (React.isValidElement(component)) {
        return React.cloneElement<FormBuilder.FieldRender>(
          component,
          { fields, ...props },
        );
      }
      if (ReactIs.isValidElementType(component)) {
        return React.createElement<FormBuilder.FieldRender>(
          component,
          { fields, ...props },
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
