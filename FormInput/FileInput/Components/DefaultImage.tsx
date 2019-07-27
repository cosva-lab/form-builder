import React from 'react';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import Typography from '@material-ui/core/Typography';

export const DefaultImage = ({
  classes,
}: {
  classes?: Record<'img', string>;
}) => (
  <div className={classes && classes.img}>
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
