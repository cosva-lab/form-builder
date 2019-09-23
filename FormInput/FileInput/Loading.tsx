import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme, fade } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      width: '100%',
      position: 'absolute',
      background: fade(theme.palette.background.default, 0.7),
      zIndex: 9,
      height: '100%',
      overflow: 'hidden',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
  }),
);
export const Loading = () => {
  const [progress, setProgress] = React.useState(0);
  const classes = useStyles();
  React.useEffect(() => {
    function tick() {
      // reset when reaching 100%
      setProgress(oldProgress =>
        oldProgress >= 100 ? 0 : oldProgress + 1,
      );
    }
    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className={classes.progress}>
      <CircularProgress variant="determinate" value={progress} />
    </div>
  );
};
