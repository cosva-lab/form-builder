import React from 'react';
import { DefaultFileThumbnail } from './DefaultFileThumbnail';
import { PropsGetThumbnail } from '../Props';

class GetThumbnail extends React.PureComponent<PropsGetThumbnail> {
  render() {
    const { file, invalid, classes } = this.props;
    if (invalid) {
      return <DefaultFileThumbnail />;
    }
    let type;
    let fileUrl;
    if (file instanceof File) {
      type = file.type;
      fileUrl = URL.createObjectURL(file);
    } else if (typeof file === 'object') {
      fileUrl = file.url;
      type = file.type;
    } else {
      fileUrl = file;
    }
    switch (type) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/svg+xml':
        return (
          <img
            className={classes && classes.img}
            alt="complex"
            src={fileUrl}
          />
        );
    }
    return <DefaultFileThumbnail />;
  }
}

export default GetThumbnail;
