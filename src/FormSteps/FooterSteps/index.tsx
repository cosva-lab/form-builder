import React from 'react';

import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';

import { StepsRenderProps, InitialStateSteps } from '../..';

import { getMessage } from '../../FieldTranslate';
import { footerRenderDefault } from './footerRenderDefault';
import classes from './FooterSteps.module.scss';

export interface Props
  extends Pick<
      StepsRenderProps,
      'handleNextStep' | 'handleBackStep' | 'footerRender'
    >,
    Pick<
      InitialStateSteps,
      'steps' | 'activeStep' | 'ns' | 'loading' | 'footerSteps'
    > {}

type AllProps = Props;

const FooterSteps = (props: AllProps) => {
  const {
    steps,
    activeStep,
    handleNextStep,
    handleBackStep,
    footerRender = footerRenderDefault,
    loading,
    footerSteps,
  } = props;
  const stepsLength = steps.length;
  const { next, back } = footerRender({
    stepsLength,
    activeStep,
    footerSteps,
  });
  return (
    <CardActions>
      <div className={classes.buttons}>
        {back.state && (
          <div className={classes.wrapper}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={() => handleBackStep(activeStep)}
            >
              {getMessage(back)}
            </Button>
          </div>
        )}
        {next.state && (
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={() => handleNextStep(activeStep)}
            >
              {getMessage(next)}
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
  );
};

export default FooterSteps;
