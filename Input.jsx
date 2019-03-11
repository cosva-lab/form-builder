import React from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      classes,
      error,
      handleChange,
      label,
      name,
      type,
      value,
      InputProps,
      ...rest
    } = this.props;
    return (
      <TextField
        label={label}
        name={name}
        type={type}
        error={error.state}
        helperText={error.message}
        value={value}
        InputProps={InputProps}
        onChange={e => {
          const { target } = e;
          const { name, value, type } = target;
          handleChange({ target: { name, value, type } });
        }}
        {...rest}
      />
    );
  }
}

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "number", "email", "date", "password"]),
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  error: PropTypes.object.isRequired,
  InputProps: PropTypes.object,
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

Input.defaultProps = {
  type: "text",
  autoComplete: "",
  InputProps: {}
};

class InputSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type } = this.props;
    return (
      <FormControl fullWidth={true}>
        {type == "date" ? (
          <Input InputLabelProps={{ shrink: true }} {...this.props} />
        ) : (
          <Input {...this.props} />
        )}
      </FormControl>
    );
  }
}

export default compose(withStyles(styles, { name: "Input" }))(InputSwitch);
