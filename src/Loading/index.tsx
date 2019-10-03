import React, { CSSProperties } from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import {
  withStyles,
  createStyles,
  WithStyles,
} from '@material-ui/core/styles';

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
        variant="indeterminate"
        className={classes.progress}
        {...{
          style,
          size,
          color,
          disableShrink,
          thickness,
          variant,
        }}
      />
    );
  }
}

export default withStyles(styles)(CircularIndeterminate);
