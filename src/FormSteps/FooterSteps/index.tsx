import React from 'react';
import { makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';

import { StepsRenderProps, InitialStateSteps } from '../..';

import { getMessage } from '../../FieldTranslate';
import { pink } from '@mui/material/colors';
import { footerRenderDefault } from './footerRenderDefault';

const useStyles = makeStyles({
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: pink[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

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
  const classes = useStyles();
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
