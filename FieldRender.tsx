import React from 'react';
import * as ReactIs from 'react-is';
import Grid from '@material-ui/core/Grid';
import isEqual from 'lodash/isEqual';
import FormInput from './FormInput/index';
import InputValidator from './utils/validate/InputValidator';
import { Message } from '../MessagesTranslate/Animation';
import {
  FormBuilder,
  Validate,
  changeField,
  ChangeField,
  Validation,
} from './';
import { transformLabel } from './utils/transformLabel';

interface State {
  value: any;
  error?: Message | undefined;
}
export default class FieldRender
  extends React.Component<FormBuilder.FieldRender, State>
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
    const { value, error } = props;

    this.state = {
      error:
        error && error.state
          ? error
          : {
              state: false,
              message: '',
            },
      value: value || '',
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
    const isDiffError = !isEqual(error, this.state.error);
    const isDiffValue = !isEqual(value, this.state.value);
    if (
      isDiffError &&
      (error && !!error.state && !!error.errorServer)
    ) {
      this.setState({
        value,
        error,
      });
    } else {
      if (isDiffError || isDiffValue)
        this.setState({
          value,
          error,
        });
      const message = await this.verifyError({
        validations,
        value,
        validChange,
        changed,
        validate,
      });
      if (!isEqual(message, this.state.error)) {
        this.setError(message);
      }
    }
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
    { target, changeStateComponent = true },
    callback,
  ) => {
    const { validations, validChange, validate } = this.props;
    const { value } = target;
    const message = await this.verifyError({
      validations,
      value,
      validChange,
      changed: true,
      validate,
    });
    if (this.mount && changeStateComponent) {
      this.setState(
        {
          value,
          error: message,
        },
        () => {
          this.props.changeField({ target }, callback);
        },
      );
    } else {
      this.props.changeField({ target }, callback);
    }
  };

  validateField = async () => {
    const { validations, validChange, validate } = this.props;
    const { value } = this.state;
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
    const { activeStep, getSteps } = this.props;

    let error;
    validations &&
      validations.some(validation => {
        if (typeof validation === 'object') {
          validationsObj.push(validation);
        } else {
          const temPError = validation({
            fields: this.props.getFields && this.props.getFields(),
            activeStep,
            steps: getSteps && getSteps(),
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
      inputProps: InputProps,
      autoComplete,
      isNew,
    } = props;

    const propsForm = {
      label: transformLabel({ label, ns, name }),
      validateField: this.validateField,
      changeField: this.changeField,
      error,
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
      isNew,
    };
    if (!state) return null;
    const formInput = <FormInput {...propsForm} />;
    if (render) {
      return render({
        children: formInput,
        props: propsForm,
      });
    }
    if (type === 'component') {
      if (React.isValidElement(component)) {
        return React.cloneElement<FormBuilder.FieldRender>(
          component,
          propsForm,
        );
      }
      if (ReactIs.isValidElementType(component)) {
        return React.createElement<FormBuilder.FieldRender>(
          component,
          propsForm,
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
