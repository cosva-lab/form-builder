import React from 'react';
import { lookup } from 'mime-types';

import { DefaultImage } from './DefaultImage';
import { PropsGetThumbnail } from '../Props';

class GetThumbnail extends React.PureComponent<PropsGetThumbnail> {
  render() {
    const { file, invalid, classes } = this.props;
    if (invalid) {
      return <DefaultImage {...{ classes }} />;
    }
    let name;
    let fileUrl;
    if (file instanceof File) {
      name = file.name;
      fileUrl = URL.createObjectURL(file);
    } else if (typeof file === 'object') {
      fileUrl = file.url;
      name = file.extension || file.url;
    } else {
      name = file;
      fileUrl = file;
    }
    switch (lookup(name)) {
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
    return <DefaultImage {...{ classes }} />;
  }
}

export default GetThumbnail;
