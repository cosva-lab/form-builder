import React from 'react';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import Typography from '@material-ui/core/Typography';
import { WithStyles } from '@material-ui/styles/withStyles';
import { styles } from './styles';

export const DefaultImage = ({
  classes,
}: WithStyles<typeof styles>) => (
  <div className={classes.img}>
    <Typography
      style={{
        color: 'rgba(51,51,51,0.4)',
      }}
      align="center"
      component={
        BrokenImageIcon as React.ElementType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      /* className="cosva-farm" */
      variant="h1"
    />
  </div>
);
