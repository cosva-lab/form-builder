import React, { CSSProperties } from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import { Theme } from '@mui/material/styles';

import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';

const styles = (theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(1),
    },
  });

interface Props extends WithStyles<typeof styles> {
  style: CSSProperties;
}

class CircularIndeterminate extends React.PureComponent<
  Props & CircularProgressProps
> {
  static defaultProps: Partial<Props & CircularProgressProps> = {
    color: 'primary',
    disableShrink: false,
    size: 40,
    thickness: 3.6,
    variant: 'indeterminate',
  };

  public render() {
    const {
      classes,
      size,
      color,
      disableShrink,
      thickness,
      variant,
      style,
    } = this.props;
    return (
      <CircularProgress
        variant={variant || 'indeterminate'}
        className={classes.progress}
        {...{
          style,
          size,
          color,
          disableShrink,
          thickness,
        }}
      />
    );
  }
}

export default withStyles(styles)(CircularIndeterminate);
