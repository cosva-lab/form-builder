import React from 'react';
import * as ReactIs from 'react-is';
import { Observer } from 'mobx-react';
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
  error?: Message | undefined;
}

export default class FieldRender
  extends React.PureComponent<FormBuilder.FieldRender, State>
  implements ChangeField {
  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    sm: 12,
    search: {
      state: false,
    },
  };

  public errorFlag: Message | undefined;
  public mount: boolean = false;

  constructor(props: FormBuilder.FieldRender) {
    super(props);
    const { error } = props;

    this.state = {
      error:
        error && error.state
          ? error
          : {
              state: false,
              message: '',
            },
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
    if (error && !!error.state && !!error.errorServer) {
      this.setState({
        error,
      });
    } else {
      if (isDiffError)
        this.setState({
          error,
        });
      const message = await this.verifyError({
        validations,
        value,
        validChange,
        changed,
        validate,
      });
      if (!isEqual(message, error)) {
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
    if (this.mount && changeStateComponent) {
      this.props.changeField({ target }, callback);
      const error = await this.verifyError({
        validations,
        value,
        validChange,
        changed: true,
        validate,
      });
      if (!isEqual(error, this.state.error))
        this.setState({
          error,
        });
    } else {
      this.props.changeField({ target }, callback);
    }
  };

  validateField = async () => {
    const { validations, validChange, validate, value } = this.props;
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
    const { error } = this.state;
    const { props } = this;
    const { sm } = props;
    const { md = sm } = props;
    const { lg = md } = props;
    const { xs = lg } = props;
    const {
      actionsExtra,
      name,
      label,
      value,
      search,
      state = true,
      render,
      ns,
      type,
      component: Component,
      extraProps,
      extra,
      inputProps,
      autoComplete,
      isNew,
      fieldProxy,
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
      component: Component,
      extraProps,
      extra,
      inputProps,
      autoComplete,
      isNew,
      fieldProxy,
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
      if (React.isValidElement(Component)) {
        return (
          <Component.type {...{ ...Component.props, ...propsForm }} />
        );
      }
      if (ReactIs.isValidElementType(Component)) {
        return (
          <Observer>
            {() => {
              return React.createElement<FormBuilder.FieldRender>(
                Component,
                { ...propsForm, ...fieldProxy },
              );
            }}
          </Observer>
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
