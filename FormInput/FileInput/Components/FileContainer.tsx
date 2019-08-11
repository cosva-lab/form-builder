import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grow from '@material-ui/core/Grow';

import FileItem from './FileItem';
import GetThumbnail from './getThumbnail';
import { Value } from '../Props';
import { withStyles, WithStyles } from '@material-ui/styles';
import Loading from '../../../../Loading';

export const duration = 800;

const styles = (theme: Theme) => {
  return createStyles({
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
    loading: {
      position: 'absolute',
      top: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: theme.palette.background.default + 'b0',
    },
  });
};

interface Props extends WithStyles<typeof styles> {
  id: number;
  value: Value;
  multiple?: boolean;
  length: number;
  deleteFile: (index: number, sendChange?: boolean) => Promise<void>;
}

interface State {
  hide: boolean;
  loading: boolean;
}

class FileContainer extends React.PureComponent<Props, State> {
  static propTypes = {
    id: PropTypes.number.isRequired,
    value: PropTypes.exact({
      value: PropTypes.oneOfType([
        PropTypes.instanceOf(File),
        PropTypes.exact({
          url: PropTypes.string.isRequired,
          file: PropTypes.oneOfType([
            PropTypes.instanceOf(File),
            PropTypes.any,
          ]),
          extra: PropTypes.any,
        }),
      ]).isRequired,
      fileOriginal: PropTypes.oneOfType([
        PropTypes.instanceOf(File),
        PropTypes.any,
      ]),
      invalid: PropTypes.bool.isRequired,
    }).isRequired,
    multiple: PropTypes.bool,
    length: PropTypes.number.isRequired,
    deleteFile: PropTypes.func.isRequired,
  };

  state = { hide: false, loading: false };

  render() {
    const {
      value,
      multiple,
      length,
      deleteFile,
      classes,
      id,
    } = this.props;
    const { loading, hide } = this.state;

    const children = React.createRef<HTMLDivElement>();
    return (
      <>
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
          <div style={{ position: 'relative' }}>
            <Grow in>
              <FileItem
                getThumbnail={GetThumbnail}
                deleteFile={() => {
                  this.setState({ loading: true });
                  deleteFile(id).catch(() => {
                    this.setState({
                      loading: false,
                    });
                  });
                }}
                {...{ value }}
              ></FileItem>
            </Grow>
            {loading && (
              <div className={classes.loading}>
                <Loading size={40} />
              </div>
            )}
          </div>
        </Grid>
      </>
    );
  }
}

export default withStyles(styles)(FileContainer);
