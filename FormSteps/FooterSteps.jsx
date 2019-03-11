import React from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";

import pink from "@material-ui/core/colors/pink";

import MessagesTranslate from "../../MessagesTranslate/MessagesTranslate";

const styles = theme => ({
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
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
  }
});

class FooterSteps extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      stepsLength,
      activeStep,
      getSteps,
      handleNextStep,
      handleBackStep,
      footer,
      loading,
      isNew,
      id,
      footerSteps,
      ns
    } = this.props;
    const { next, back } = footer({
      stepsLength,
      activeStep,
      footerSteps
    });
    return (
      <React.Fragment>
        {activeStep !== stepsLength && (
          <CardActions>
            <div className={classes.buttons}>
              {back.state && (
                <div className={classes.wrapper}>
                  <Button
                    disabled={activeStep === 0 || loading}
                    onClick={e => handleBackStep(activeStep)}
                  >
                    <MessagesTranslate type={back.message} ns={back.ns} />
                  </Button>
                </div>
              )}
              {next.state && (
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    onClick={() =>
                      handleNextStep(activeStep, getSteps(), {
                        isNew,
                        id
                      })
                    }
                  >
                    <MessagesTranslate type={next.message} ns={next.ns} />
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              )}
            </div>
          </CardActions>
        )}
      </React.Fragment>
    );
  }
}

FooterSteps.propTypes = {
  loading: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  footer: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  handleBackStep: PropTypes.func.isRequired
};

FooterSteps.defaultProps = {
  footer: ({ stepsLength, activeStep, footerSteps }) => {
    var steps = {
      next: {
        message: activeStep !== stepsLength - 1 ? "next" : "done",
        state: true,
        ns: "general"
      },
      back: {
        message: "back",
        state: true,
        ns: "general"
      }
    };
    Object.keys(footerSteps).map((step, key) => {
      if (activeStep == step) {
        const { next, back } = footerSteps[step];
        steps = {
          ...steps,
          next: { ...steps.next, ...next },
          back: { ...steps.back, ...back }
        };
      }
    });
    return steps;
  },
  ns: "general"
};

export default compose(withStyles(styles, { name: "FooterSteps" }))(
  FooterSteps
);
