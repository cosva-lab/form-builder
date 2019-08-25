import React from 'react';
import compose from 'recompose/compose';
import {
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import FieldsRender from '../FieldsRender';
import FooterSteps from './FooterSteps';
import { WithStyles } from '@material-ui/styles';
import { StepsRender } from '../index';
import { getMessage } from '../../MessagesTranslate/Animation';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepContent } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(4),
      margin: theme.spacing(2),
      width: '100%',
    },
  });

type Props = StepsRender;

type AllProps = Props & WithStyles<typeof styles>;

class FormSteps extends React.Component<AllProps> {
  static defaultProps = {
    render: false,
    renderSteps: false,
    header: true,
    footerSteps: {},
    ns: 'inputs',
  };

  render() {
    const { props } = this;
    const {
      loading,
      getSteps = () => props.steps,
      activeStep,
      handleNextStep,
      changeField,
      handleBackStep,
      footerRender,
      footerSteps,
      stepperProps,
      gridProps,
      children,
      isNew,
    } = props;
    const steps = getSteps();
    const fieldsTemp = steps.map((step, key) => {
      const {
        fields,
        ns = props.ns,
        transPosition = false,
        validate,
      } = step || {
        fields: undefined,
        validate: undefined,
      };
      return (
        fields && (
          <>
            <Grid item xs={12}>
              {fields && (
                <FieldsRender
                  key={activeStep}
                  ns={ns}
                  transPosition={transPosition}
                  validate={validate}
                  fields={fields}
                  changeField={changeField}
                  isNew={isNew}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <FooterSteps
                {...{
                  ns,
                  handleNextStep,
                  handleBackStep,
                  steps,
                  footerSteps,
                  footerRender,
                  activeStep,
                  loading,
                  isNew,
                }}
              />
            </Grid>
          </>
        )
      );
    });
    return (
      <React.Fragment>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stepper activeStep={activeStep} {...stepperProps}>
              {steps.map((step, key) => {
                const {
                  label,
                  stepper: stepperState = true,
                  ns = props.ns,
                } = step;
                return stepperState ? (
                  <Step key={`step-${key}`}>
                    <StepLabel>
                      {getMessage({
                        ns:
                          typeof label === 'string'
                            ? ns
                            : label.ns || ns,
                        message:
                          typeof label === 'string'
                            ? label
                            : label.message,
                      })}
                    </StepLabel>
                    {stepperProps &&
                      stepperProps.orientation === 'vertical' && (
                        <StepContent>{fieldsTemp[key]}</StepContent>
                      )}
                  </Step>
                ) : null;
              })}
            </Stepper>
          </Grid>
          {children}
          {((stepperProps &&
            (!stepperProps.orientation ||
              stepperProps.orientation === 'horizontal')) ||
            !stepperProps) && (
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={4}
              {...gridProps}
            >
              {fieldsTemp[activeStep]}
            </Grid>
          )}
        </Grid>
      </React.Fragment>
    );
  }
}

export default compose<AllProps, Props>(
  withStyles(styles, { name: 'formSteps' }),
)(FormSteps);
