import React, { CSSProperties } from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

import classes from './Loading.module.scss';

interface Props {
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
    const { size, color, disableShrink, thickness, variant, style } =
      this.props;
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

export default CircularIndeterminate;
