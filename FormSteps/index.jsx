import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Translation } from 'react-i18next';

import FieldsRender from '../FieldsRender/index';
import FooterSteps from './FooterSteps';
import StepperComponents from './Stepper';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 2,
    width: '100%',
  },
});

class FormSteps extends React.Component {
  render() {
    const { props } = this;
    const {
      classes,
      loading,
      renderSteps,
      getSteps,
      render,
      activeStep,
      handleNextStep,
      handleChange,
      handleBackStep,
      isNew,
      footer,
      footerSteps,
      id,
    } = props;

    const {
      fields,
      renderStep = false,
      stepper = true,
      header = props.header,
      label = {},
      ns = props.ns,
      transPosition = false,
      validate,
      elevation = 0,
    } = getSteps()[activeStep] || {};

    const itemsStepper = getSteps().map(step => {
      const { label, stepper = true } = step;
      return { label, stepper };
    });
    return (
      <React.Fragment>
        <Grid container spacing={24}>
          {stepper && (
            <StepperComponents
              {...{ ns, activeStep, itemsStepper }}
            />
          )}
          <Paper className={classes.root} elevation={elevation}>
            {header && label.message && (
              <Typography variant="h5" gutterBottom>
                <Translation ns={label.ns ? label.ns : ns}>
                  {l => {
                    return l(label.message);
                  }}
                </Translation>
              </Typography>
            )}
            {render
              ? (() => {
                  const { state, components } = render;
                  return Object.keys(components).map((step, key) => {
                    if (state == step) {
                      return (
                        <Grid item xs={12} key={key}>
                          {components[step]}
                        </Grid>
                      );
                    } else {
                      return null;
                    }
                  });
                })()
              : null}
            {renderSteps
              ? (() => {
                  return Object.keys(renderSteps).map((step, key) => {
                    if (activeStep == step) {
                      return (
                        <Grid item xs={12} key={key}>
                          {renderSteps[step]}
                        </Grid>
                      );
                    } else {
                      return null;
                    }
                  });
                })()
              : null}
            {renderStep ? (
              <Grid item xs={12}>
                {renderStep}
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={16}
              >
                {fields && (
                  <FieldsRender
                    key={activeStep}
                    ns={ns}
                    transPosition={transPosition}
                    validate={validate}
                    fields={fields}
                    allProps={props}
                    handleChange={handleChange}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
          <Grid>
            <FooterSteps
              stepsLength={getSteps().length}
              {...{
                ns,
                handleNextStep,
                handleBackStep,
                getSteps,
                footer,
                footerSteps,
                activeStep,
                loading,
                isNew,
                id,
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

FormSteps.propTypes = {
  loading: PropTypes.bool.isRequired,
  steps: PropTypes.array,
  step: PropTypes.object,
  ns: PropTypes.string.isRequired,
  activeStep: PropTypes.number.isRequired,
  footer: PropTypes.func,
  footerSteps: PropTypes.object,
  getSteps: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  handleBackStep: PropTypes.func.isRequired,
};

FormSteps.defaultProps = {
  render: false,
  renderSteps: false,
  header: true,
  footerSteps: {},
  ns: 'inputs',
};

export default compose(withStyles(styles, { name: 'formSteps' }))(
  FormSteps,
);
