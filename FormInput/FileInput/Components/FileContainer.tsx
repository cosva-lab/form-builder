import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import Grow from '@material-ui/core/Grow';

import FileItem from './FileItem';
import GetThumbnail from './getThumbnail';
import { Value } from '../Props';

export const duration = 800;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridHideTransition: {
      transition: theme.transitions.create('all', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    gridHide: {
      animationFillMode: 'forwards',
      animation: `$gridHiden ${duration}ms ${theme.transitions.easing.easeInOut} `,
      overflow: 'hidden',
    },
    '@keyframes gridHiden': {
      '100%': {
        flexBasis: '0',
        flexGrow: 0,
      },
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      OUserSelect: 'none',
      userSelect: 'none',
      WebkitUserDrag: 'none',
    },
  }),
);

type FileContainer = React.FC<{
  value: Value;
  multiple?: boolean;
  length: number;
  deleteFile: (id: string) => void;
}>;

export const FileContainer: FileContainer = ({
  value,
  multiple,
  length,
  deleteFile,
}) => {
  const classes = useStyles();

  const [hide, set] = React.useState(false);
  const [isHide, setIsHide] = React.useState(false);

  const children = React.createRef<HTMLDivElement>();
  const { invalid } = value;
  if (invalid) {
    setTimeout(() => {
      set(true);
    }, duration);
    setTimeout(() => {
      if (children.current) {
        children.current.style.paddingLeft = '0px';
        children.current.style.paddingRight = '0px';
      }
      setTimeout(() => {
        setIsHide(true);
      }, duration);
    }, duration + (duration * 1) / 100);
  }
  if (!isHide) {
    return (
      <Grid
        item
        {...(multiple && length > 1
          ? {
              sm: 6,
              md: 6,
              xs: true,
            }
          : {
              xs: 12,
            })}
        className={clsx(
          classes.gridHideTransition,
          hide && classes.gridHide,
        )}
        ref={children}
      >
        <Grow in>
          <FileItem
            getThumbnail={GetThumbnail}
            deleteFile={() => {
              setIsHide(true);
              deleteFile(value.id);
            }}
            value={value}
          ></FileItem>
        </Grow>
      </Grid>
    );
  }
  return null;
};

FileContainer.propTypes = {
  value: PropTypes.exact({
    file: PropTypes.oneOfType([
      PropTypes.instanceOf(File),
      PropTypes.string,
    ]).isRequired,
    id: PropTypes.string.isRequired,
    invalid: PropTypes.bool.isRequired,
  }).isRequired,
  multiple: PropTypes.bool,
  length: PropTypes.number.isRequired,
  deleteFile: PropTypes.func.isRequired,
};
