import React from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Typography from '@material-ui/core/Typography';

export const DefaultFileThumbnail = () => (
  <Typography
    style={{
      width: '100%',
    }}
    color="textPrimary"
    align="center"
    component={FileCopyIcon as any}
    /* className="cosva-farm" */
    variant="h1"
  />
);
