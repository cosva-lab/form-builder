import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { Translation } from 'react-i18next';
import FormInput from '../FormInput/index';
import InputValidator from '../../Validator/InputValidator';
import { getMessage } from '../../MessagesTranslate/Animation';

class FieldRender extends React.PureComponent {
  static propTypes = {
    helpMessage: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.any,
    ns: PropTypes.string,
    transPosition: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    label: PropTypes.shape({
      message: PropTypes.string.isRequired,
      ns: PropTypes.string,
      notPos: PropTypes.bool,
    }).isRequired,
    search: PropTypes.shape({
      state: PropTypes.bool.isRequired,
      value: PropTypes.number.isRequired,
    }),
    validate: PropTypes.bool.isRequired,
    validation: PropTypes.array.isRequired,
    changed: PropTypes.bool,
    validChange: PropTypes.bool,
    state: PropTypes.bool,
    error: PropTypes.shape({
      state: PropTypes.bool,
      message: PropTypes.string,
    }),
    actions: PropTypes.shape({
      onDelete: PropTypes.func,
      onAdd: PropTypes.func,
    }),
    render: PropTypes.bool,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xs: PropTypes.number,
    waitTime: PropTypes.bool,
    accept: PropTypes.string,
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.object,
    ]),
    extensions: PropTypes.array,
  };

  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    sm: 12,
    search: {
      state: false,
      value: -1,
    },
    helpMessage: true,
    waitTime: true,
  };

  constructor(props) {
    super(props);
    const {
      value,
      changed,
      validChange = false,
      validate,
      validation,
      error,
    } = props;
    this.state = {
      value,
      validChange,
      validate,
      error: this.verifyError({
        error,
        validation,
        value,
        validChange,
        changed,
        validate,
      }),
    };
  }

  componentWillReceiveProps(newProps) {
    const {
      value,
      changed,
      validChange = false,
      validate,
      validation,
      error,
    } = newProps;
    this.setState({
      value,
      validChange,
      validate,
      error: this.verifyError({
        error,
        validation,
        value,
        validChange,
        changed,
        validate,
      }),
    });
  }

  handleChange = ({ target, waitTime = false }) => {
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
    error = {},
    validation,
    value,
    validChange,
    changed,
    validate,
  }) {
    if (error.state) return error;
    return new InputValidator(validation).validate({
      value,
      validChange,
      changed,
      validate,
    }).error;
  }

  render() {
    const { value, error } = this.state;
    const { sm } = this.props;
    const { md = sm } = this.props;
    const { lg = md } = this.props;
    const { xs = lg } = this.props;
    const {
      name,
      label,
      search,
      helpMessage,
      state = true,
      waitTime,
      FieldRenderKey,
      render = false,
      ns,
      searchId,
      serverConfig,
      type,
      accept,
      extensions,
      component,
      actions,
    } = this.props;
    const { message = name, ns: nsLabel = ns } = label;
    if (!state) return null;
    if (render) return { ...render, key: FieldRenderKey };
    let { transPosition = '' } = this.props;
    if (transPosition !== '') transPosition += '.';
    return (
      <Grid item sm={sm} md={md} lg={lg} xs={xs}>
        <FormInput
          error={error}
          label={getMessage({
            message: `${transPosition}${message}`,
            ns: nsLabel,
            styles: { top: '-8px', position: 'absolute' },
          })}
          {...{
            ns,
            name,
            value,
            type,
            search,
            waitTime,
            validateField: this.validateField,
            searchId,
            serverConfig,
            transPosition,
            helpMessage,
            handleChange: this.handleChange,
            accept,
            extensions,
            component,
            actions,
          }}
        />
      </Grid>
    );
  }
}

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

// eslint-disable-next-line react/no-multi-comp
class FieldsRender extends React.PureComponent {
  renderForm = () => {
    const {
      fields,
      validate,
      handleChange,
      ns,
      transPosition,
      allProps,
    } = this.props;
    if (!fields) return null;
    return Object.keys(fields).map(name => {
      let search = {
        state: false,
        value: -1,
      };
      const {
        label = {
          message: name,
          ns,
          notPos: !!transPosition,
        },
      } = fields[name];
      const { helpMessage = true, searchId, id } = fields[name];
      if (searchId) {
        let valueSearchId;
        try {
          switch (typeof searchId) {
            case 'string':
              valueSearchId = searchId;
              if (fields[valueSearchId]) {
                search = {
                  state: fields[valueSearchId].value !== '',
                  value:
                    fields[valueSearchId].value === ''
                      ? -1
                      : fields[valueSearchId].value,
                };
              } else {
                throw new Error(
                  `El input "${valueSearchId}" no existe!`,
                );
              }
              break;
            case 'function':
              valueSearchId = searchId(allProps);
              search = {
                state: true,
                value: valueSearchId,
              };
              break;
            default:
              break;
          }
        } catch (e) {
          console.log(e);
        }
      } else if (id) {
        try {
          // eslint-disable-next-line no-restricted-globals
          if (id && !isNaN(Number(id))) {
            search = {
              state: true,
              value: Number(id),
            };
          } else {
            throw new Error(
              `El campo ${fields[name]} tiene valor no permitido!`,
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
      return (
        <FieldRender
          key={name}
          ns={ns}
          name={name}
          {...{
            ...fields[name],
            transPosition,
            label,
            helpMessage,
            validate,
            handleChange,
            search,
          }}
        />
      );
    });
  };

  render() {
    return <React.Fragment>{this.renderForm()}</React.Fragment>;
  }
}

FieldsRender.propTypes = {
  handleChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  ns: PropTypes.string,
  transPosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  fields: PropTypes.object,
};

FieldsRender.defaultProps = {
  ns: 'inputs',
  transPosition: '',
};

export default compose(withStyles(styles, { name: 'FieldsRender' }))(
  FieldsRender,
);
