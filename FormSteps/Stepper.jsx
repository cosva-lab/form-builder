import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import { getMessage } from '../../MessagesTranslate/Animation';

const styles = theme => ({});

class StepperComponents extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { props } = this;
    const { itemsStepper, ns, activeStep } = props;
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
  }
}

StepperComponents.propTypes = {
  ns: PropTypes.string.isRequired,
  activeStep: PropTypes.number.isRequired,
  itemsStepper: PropTypes.array.isRequired,
};

export default compose(withStyles(styles, { name: 'Stepper' }))(
  StepperComponents,
);
