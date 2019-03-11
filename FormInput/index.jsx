import React from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import Input from "../../Forms/Input";
import BoxForm from "../../Forms/Table/BoxForm";
import DropdownList from "../../DropdownList/DropdownList";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  input: {
    marginBottom: theme.spacing.unit * 1
  }
});

class FormInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      InputProps,
      label,
      helpMessage,
      handleChange,
      type,
      value,
      name,
      route,
      searchId,
      search,
      error,
      renderItem,
      disabled,
      classes,
      ...propsRest
    } = this.props;
    const { state, message } = error;
    return (
      <React.Fragment>
        {(() => {
          switch (type) {
            case "text":
            case "number":
            case "email":
            case "password":
            case "time":
            case "date":
              return (
                <Input
                  className={classes.input}
                  {...{
                    ...propsRest,
                    InputProps,
                    label,
                    name,
                    value,
                    type,
                    error: {
                      state: state,
                      message: message
                    },
                    type,
                    disabled,
                    handleChange
                  }}
                />
              );
            case "list":
              return (
                <DropdownList
                  search={search}
                  searchId={searchId}
                  fullWidth
                  route={route}
                  helpMessage={helpMessage}
                  renderItem={renderItem}
                  defaultValue={value}
                  value={value}
                  error={state}
                  message={message}
                  onChange={handleChange}
                  disabled={disabled}
                  {...{ ...propsRest, label, name }}
                />
              );
            case "table":
              return (
                <BoxForm
                  value={value}
                  {...{ ...propsRest, label, name }}
                  onChange={handleChange}
                />
              );
            case "checkbox":
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={e => {
                        const { target } = e;
                        const { name, checked, type } = target;
                        handleChange({
                          target: { name, checked, type }
                        });
                      }}
                      name={name}
                      {...propsRest}
                      disabled={disabled}
                    />
                  }
                  label={label}
                />
              );
            case "render":
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={e => {
                        const { target } = e;
                        const { name, checked, type } = target;
                        handleChange({
                          target: { name, checked, type }
                        });
                      }}
                      name={name}
                      {...propsRest}
                      disabled={disabled}
                    />
                  }
                  label={label}
                />
              );
            default:
              break;
          }
        })()}
      </React.Fragment>
    );
  }
}

FormInput.propTypes = {
  helpMessage: PropTypes.bool.isRequired,
  InputProps: PropTypes.object.isRequired,
  type: PropTypes.string,
  type: PropTypes.oneOf([
    "time",
    "text",
    "number",
    "email",
    "date",
    "password",
    "list",
    "table",
    "checkbox",
    "render"
  ]),
  handleChange: PropTypes.func.isRequired
};

FormInput.defaultProps = {
  type: "text",
  disabled: false,
  helpMessage: true,
  InputProps: {},
  route: ""
};

export default compose(withStyles(styles, { name: "formInput" }))(FormInput);
