import React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

import classes from './Loading.module.scss';

const CircularIndeterminate = ({
  style,
  color = 'primary',
  disableShrink = false,
  size = 40,
  thickness = 3.6,
  variant = 'indeterminate',
}: CircularProgressProps) => (
  <CircularProgress
    variant={variant || 'indeterminate'}
    className={classes.progress}
    style={style}
    size={size}
    color={color}
    disableShrink={disableShrink}
    thickness={thickness}
  />
);

export default CircularIndeterminate;
