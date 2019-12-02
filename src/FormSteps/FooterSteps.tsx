import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';

import pink from '@material-ui/core/colors/pink';

import createStyles from '@material-ui/core/styles/createStyles';
import { StepsRender, InitialStateSteps } from '..';
import { getMessage } from '../MessageTranslate';

const styles = () =>
  createStyles({
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

interface Props
  extends Pick<
      StepsRender,
      'handleNextStep' | 'handleBackStep' | 'footerRender'
    >,
    Pick<
      InitialStateSteps,
      'steps' | 'activeStep' | 'ns' | 'loading' | 'footerSteps'
    > {}

type AllProps = Props & WithStyles<typeof styles>;
const footerRenderDefault: Required<Props>['footerRender'] = ({
  stepsLength,
  footerSteps,
  ...rest
}) => {
  const activeStep = rest.activeStep;
  let steps = {
    next: {
      message: activeStep !== stepsLength - 1 ? 'next' : 'done',
      state: true,
      ns: 'general',
    },
    back: {
      message: 'back',
      state: true,
      ns: 'general',
    },
  };
  if (footerSteps) {
    Object.keys(footerSteps).forEach(step => {
      if (activeStep.toString() === step) {
        if (footerSteps.hasOwnProperty(step)) {
          const footerStep = footerSteps[activeStep];
          const next = (footerStep && footerStep.next) || {};
          const back = (footerStep && footerStep.back) || {};
          steps = {
            ...steps,
            next: { ...steps.next, ...next },
            back: { ...steps.back, ...back },
          };
        }
      }
    });
  }
  return steps;
};
class FooterSteps extends React.Component<AllProps> {
  static propTypes = {
    loading: PropTypes.bool,
    footerRender: PropTypes.func,
    handleNextStep: PropTypes.func.isRequired,
    handleBackStep: PropTypes.func.isRequired,
  };

  static defaultProps: Partial<AllProps> = {
    footerRender: footerRenderDefault,
    ns: 'general',
  };

  render() {
    const {
      classes,
      steps,
      activeStep,
      handleNextStep,
      handleBackStep,
      footerRender = footerRenderDefault,
      loading,
      footerSteps,
    } = this.props;
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
  }
}

export default compose<AllProps, Props>(
  withStyles(styles, { name: 'FooterSteps' }),
)(FooterSteps);
