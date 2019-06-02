import React from 'react';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import FormInput from '../FormInput/index';
import InputValidator from '../utils/validate/InputValidator';
import {
  getMessage,
  Message,
} from '../../MessagesTranslate/Animation';
import {
  FieldsRenderProps,
  FieldRenderProps,
  Validations,
  Validate,
  handleChangeFieldRender,
} from '..';

class FieldRender extends React.PureComponent<
  FieldRenderProps,
  Validations & { value: any; error: Message }
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

  constructor(props: FieldRenderProps) {
    super(props);
    this.updateProps(props);
  }

  componentWillReceiveProps(newProps: FieldRenderProps) {
    this.updateProps(newProps);
  }

  public updateProps({
    value,
    changed,
    validChange = false,
    validate,
    validation,
  }: FieldRenderProps) {
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
      render = false,
      ns,
      type,
      component,
      actions,
      validation,
      extraProps,
    } = this.props;
    const { message = name, ns: nsLabel = ns, props } = label;
    if (!state) return null;
    let { transPosition } = label;
    if (transPosition !== '') transPosition += '.';
    const formInput = (
      <FormInput
        label={getMessage({
          message: `${transPosition}${message}`,
          ns: nsLabel,
          styles: { top: '-8px', position: 'absolute' },
          props,
        })}
        error={error}
        {...{
          name,
          type,
          value,
          actionsExtra,
          ns,
          transPosition,
          search,
          waitTime,
          validateField: this.validateField,
          handleChange: this.handleChange,
          component,
          actions,
          validation,
          extraProps,
        }}
      />
    );
    if (render) {
      return render({
        children: formInput,
      });
    }
    if (type === 'component') {
      if (React.isValidElement(component)) {
        return React.cloneElement(component, {
          ...this.props,
        });
      }
      if (typeof component === 'function') {
        return React.createElement<FieldRenderProps>(
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

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

// eslint-disable-next-line react/no-multi-comp
class FieldsRender extends React.PureComponent<FieldsRenderProps> {
  static defaultProps = {
    ns: 'inputs',
    transPosition: '',
  };
  renderForm = () => {
    const {
      fields,
      validate,
      handleChange,
      actionsExtra,
      ns,
      transPosition,
    } = this.props;
    if (!fields) return null;
    return fields.map(field => {
      let search = {
        state: false,
        value: -1,
      };
      const {
        label = {
          message: field.name,
          ns,
          notPos: !!transPosition,
        },
      } = field;
      let { extraProps } = field;
      const { searchField, id } = extraProps || {
        searchField: false,
        id: null,
      };
      if (searchField) {
        let valueSearchId: string | number;
        try {
          switch (typeof searchField) {
            case 'string':
              valueSearchId = searchField;
              const fieldFind = fields.find(
                field => field.name == searchField,
              );
              if (fieldFind) {
                search = {
                  state: fieldFind.value !== '',
                  value:
                    fieldFind.value === '' ? -1 : fieldFind.value,
                };
              } else {
                throw new Error(
                  `El input "${valueSearchId}" no existe!`,
                );
              }
              break;
            case 'function':
              valueSearchId = searchField(fields);
              extraProps = {
                ...extraProps,
                search: {
                  state: true,
                  value: valueSearchId,
                },
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
              `El campo ${field.name} tiene valor no permitido!`,
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
      return (
        <FieldRender
          key={field.name}
          ns={ns}
          name={field.name}
          extraProps={extraProps}
          {...{
            ...field,
            transPosition,
            label,
            validate,
            actionsExtra,
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

export default compose(withStyles(styles, { name: 'FieldsRender' }))(
  FieldsRender,
);
