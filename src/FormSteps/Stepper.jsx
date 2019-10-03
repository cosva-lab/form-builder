import React from 'react';
import PropTypes from 'prop-types';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import { getMessage } from '../MessagesTranslate';

const StepperComponents = props => {
  const { itemsStepper, activeStep } = props;
  return (
    <Grid item xs={12}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {itemsStepper.map((step, key) => {
          const { label, stepper = true } = step;
          return stepper ? (
            <Step key={key}>
              <StepLabel>{getMessage(label)}</StepLabel>
            </Step>
          ) : null;
        })}
      </Stepper>
    </Grid>
  );
};

StepperComponents.propTypes = {
  ns: PropTypes.string.isRequired,
  activeStep: PropTypes.number.isRequired,
  itemsStepper: PropTypes.array.isRequired,
};

export default StepperComponents;
