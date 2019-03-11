import React from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FieldsRender from "../../Forms/FieldsRender/index";
import InputsValidator from "../../Validator/InputsValidator";
import { renderFields } from "../../../reducers/Actions/index";
import MessagesTranslate from "../../MessagesTranslate";

const styles = theme => ({});

class BoxStacker extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const { fields } = props;
    this.state = {
      fields: renderFields({ fields }),
      validate: false
    };
  }

  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState((state, props) => {
      const { fields } = state;
      return {
        ...state,
        fields: {
          ...fields,
          [name]: {
            ...fields[name],
            error: { state: false, message: "" },
            changed: true,
            value: value
          }
        }
      };
    });
  };

  addBox = data => {
    const { state, props } = this;
    const { handleAddBox } = props;
    const { fields } = state;
    if (
      !new InputsValidator().validate({
        step: { fields }
      })
    ) {
      this.setState((state, props) => {
        const { fields } = state;
        return {
          ...state,
          validate: true
        };
      });
    } else {
      handleAddBox(data);
    }
  };

  render() {
    const { state, props, handleChange, addBox } = this;
    const { validate, fields } = state;
    const { ns, buttonTitle } = props;
    return (
      <Grid container spacing={24}>
        <FieldsRender
          ns={ns}
          validate={validate}
          fields={fields}
          handleChange={handleChange}
        />
        <Grid item xs={12}>
          <Grid
            container
            spacing={16}
            alignItems={"center"}
            direction={"row"}
            justify={"center"}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => addBox(fields)}
            >
              <MessagesTranslate ns={ns} type={buttonTitle} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default compose(withStyles(styles, { name: "Bookings" }))(BoxStacker);
