import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import StepComponent from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

import { FieldsRender } from '../FieldsRender';
import FooterSteps from './FooterSteps';
import type { StepsRenderProps } from '../types';
import { GlobalTranslate } from '../contexts/GlobalTranslate';

const FormSteps = observer((props: StepsRenderProps) => {
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
  const { activeStep, loading, footerSteps } = stepsBuild;
  const steps = getSteps();
  const fieldsTemp = (activeStep: number) => {
    const {
      fields,
      ns = stepsBuild.ns,
      validate,
    } = steps[activeStep];
    return (
      fields && (
        <>
          <Grid item xs={12}>
            {fields && (
              <FieldsRender
                ns={ns}
                validate={validate}
                fields={fields}
                getSteps={() => steps}
                changeField={changeField}
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
                    <GlobalTranslate
                      {...{
                        ns:
                          typeof label === 'string'
                            ? ns
                            : label.ns || ns,
                        message:
                          typeof label === 'string'
                            ? label
                            : label.message,
                      }}
                    />
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
            justifyContent="center"
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
});

export default FormSteps;
