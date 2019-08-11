import React from 'react';
import { DefaultFileThumbnail } from './DefaultFileThumbnail';
import { PropsGetThumbnail } from '../Props';

class GetThumbnail extends React.PureComponent<PropsGetThumbnail> {
  render() {
    const { value, invalid, classes } = this.props;
    if (invalid) {
      return <DefaultFileThumbnail />;
    }
    let type;
    let fileUrl;
    if (value instanceof File) {
      type = value.type;
      fileUrl = URL.createObjectURL(value);
    } else if (typeof value === 'object') {
      fileUrl = value.url;
      type =
        (value.file && value.file.type) ||
        (value.extra && value.extra.type);
    } else {
      fileUrl = value;
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
