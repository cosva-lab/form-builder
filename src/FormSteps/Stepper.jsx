import React from 'react';
import PropTypes from 'prop-types';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grid from '@mui/material/Grid';
import { getMessage } from '../MessagesTranslate';

const StepperComponents = (props) => {
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
