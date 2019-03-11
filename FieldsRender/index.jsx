import React from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import pink from "@material-ui/core/colors/pink";
import FormInput from "../FormInput/index";
import InputValidator from "../../Validator/InputValidator";

import { I18n } from "react-i18next";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  card: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 2
  },
  wrapper: {
    position: "relative"
  },
  buttonProgress: {
    color: pink[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  avatar: {
    margin: 10
  },
  bigAvatar: {
    width: 80,
    height: 80
  },
  clap: {
    display: "flex",
    justifyContent: "center"
  }
});

class FieldRender extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;
    const { sm } = props;
    const { md = sm } = props;
    const { lg = md } = props;
    const { xs = lg } = props;
    const {
      validate,
      handleChange,
      name,
      changed,
      label,
      search,
      helpMessage,
      validChange = false,
      state = true,
      validation,
      FieldRenderKey,
      render = false,
      serverError,
      value = "",
      transPosition,
      error = { message: "", state: false },
      ...rest
    } = props;
    const { message = name, ns = props.ns, notPos = true } = label;
    return state ? (
      render ? (
        { ...render, key: FieldRenderKey }
      ) : (
        <Grid item sm={sm} md={md} lg={lg} xs={xs}>
          <I18n ns={ns}>
            {t => {
              return (
                <FormInput
                  error={
                    !error.state
                      ? new InputValidator(validation).validate({
                          value,
                          validChange,
                          changed,
                          validate
                        }).error
                      : error
                  }
                  {...{
                    ...rest,
                    label: t(
                      `${
                        transPosition ? (notPos ? `${transPosition}.` : "") : ""
                      }${message}`
                    ),
                    helpMessage,
                    handleChange,
                    name,
                    value,
                    search
                  }}
                />
              );
            }}
          </I18n>
        </Grid>
      )
    ) : null;
  }
}

FieldRender.propTypes = {
  helpMessage: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  ns: PropTypes.string,
  transPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  label: PropTypes.shape({
    message: PropTypes.string.isRequired,
    ns: PropTypes.string,
    notPos: PropTypes.bool
  }).isRequired,
  search: PropTypes.shape({
    state: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  validate: PropTypes.bool.isRequired
};

FieldRender.defaultProps = {
  ns: "inputs",
  transPosition: false,
  sm: 12,
  search: {
    state: false,
    value: -1
  },
  helpMessage: true
};

class FieldsRender extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      fields,
      validate,
      handleChange,
      ns,
      transPosition,
      allProps
    } = this.props;
    return (
      fields !== undefined &&
      Object.keys(fields).map((name, key) => {
        let search = {
          state: false,
          value: -1
        };
        const {
          label = { message: name, ns, notPos: transPosition ? true : false }
        } = fields[name];
        const helpMessage =
          fields[name].hasOwnProperty("helpMessage") &&
          typeof fields[name].helpMessage === "boolean"
            ? fields[name].helpMessage
            : true;
        if (fields[name].hasOwnProperty("searchId")) {
          const { searchId } = fields[name];
          let valueSearchId;
          try {
            switch (typeof searchId) {
              case "string":
                valueSearchId = searchId;
                if (fields[valueSearchId]) {
                  search = {
                    state: fields[valueSearchId].value === "" ? false : true,
                    value:
                      fields[valueSearchId].value === ""
                        ? -1
                        : fields[valueSearchId].value
                  };
                } else {
                  throw new Error(`El input "${valueSearchId}" no existe!`);
                }
                break;
              case "function":
                valueSearchId = searchId(allProps);
                search = {
                  state: true,
                  value: valueSearchId
                };
                break;
            }
          } catch (e) {
            console.log(e);
          }
        } else if (fields[name].hasOwnProperty("id")) {
          try {
            if (fields[name].id && !isNaN(Number(fields[name].id))) {
              search = {
                state: true,
                value: Number(fields[name].id)
              };
            } else {
              throw new Error(
                `El campo ${fields[name]} tiene valor "${id}" no permitido!`
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
        return (
          <FieldRender
            key={key}
            ns={ns}
            transPosition={transPosition}
            name={name}
            {...{
              ...fields[name],
              label,
              helpMessage,
              validate,
              handleChange,
              search
            }}
          />
        );
      })
    );
  }
}

FieldsRender.propTypes = {
  handleChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  ns: PropTypes.string,
  transPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fields: PropTypes.object
};

FieldsRender.defaultProps = {
  ns: "inputs",
  transPosition: false
};

export default compose(withStyles(styles, { name: "FieldsRender" }))(
  FieldsRender
);
