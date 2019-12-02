import React from 'react';
import compose from 'recompose/compose';
import {
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import { WithStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import StepComponent from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { StepContent } from '@material-ui/core';
import { observer } from 'mobx-react';

import { FieldsRender } from '../FieldsRender';
import FooterSteps from './FooterSteps';
import { StepsRender } from '..';
import { getMessage } from '../MessageTranslate';

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

@observer
class FormStepsComponent extends React.Component<AllProps> {
  render() {
    const { props } = this;
    const {
      getSteps = () => props.stepsBuild.steps,
      handleNextStep,
      changeField,
      handleBackStep,
      footerRender,
      stepperProps,
      gridProps,
      children,
      stepsBuild,
    } = props;
    const { activeStep, isNew, loading, footerSteps } = stepsBuild;
    const steps = getSteps();
    const fieldsTemp = (activeStep: number) => {
      const {
        fields,
        ns = stepsBuild.ns,
        transPosition = false,
        validate,
      } = steps[activeStep];
      return (
        fields && (
          <>
            <Grid item xs={12}>
              {fields && (
                <FieldsRender
                  ns={ns}
                  transPosition={transPosition}
                  validate={validate}
                  fields={fields}
                  getSteps={() => steps}
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
    };
    return (
      <React.Fragment>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stepper activeStep={activeStep} {...stepperProps}>
              {steps.map((step, key) => {
                const {
                  label,
                  stepper: stepperState = true,
                  ns = stepsBuild.ns,
                } = step;
                return stepperState ? (
                  <StepComponent key={`step-${key}`}>
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
                        <StepContent>{fieldsTemp(key)}</StepContent>
                      )}
                  </StepComponent>
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
              {fieldsTemp(activeStep)}
            </Grid>
          )}
        </Grid>
      </React.Fragment>
    );
  }
}

export const FormSteps = compose<AllProps, Props>(
  withStyles(styles, { name: 'formSteps' }),
)(FormStepsComponent);

export default FormSteps;
