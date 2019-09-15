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
import { compose } from 'recompose';

export const duration = 800;

const styles = (theme: Theme) => {
  return createStyles({
    gridFile: {
      cursor: 'move',
      position: 'relative',
    },
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
      zIndex: theme.zIndex.modal + 1,
    },
  });
};

interface Props {
  position: number;
  length: number;
  value: Value;
  multiple?: boolean;
  deleteFile: (index: number, sendChange?: boolean) => Promise<void>;
}

interface AllProps extends Props, WithStyles<typeof styles> {}

interface State {
  hide: boolean;
  loading: boolean;
  position: any;
  bounds: any;
}

class FileContainer extends React.PureComponent<AllProps, State> {
  static propTypes = {
    position: PropTypes.number.isRequired,
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
      id: PropTypes.string.isRequired,
    }).isRequired,
    multiple: PropTypes.bool,
    length: PropTypes.number.isRequired,
    deleteFile: PropTypes.func.isRequired,
  };

  state = {
    hide: false,
    loading: false,
    position: { x: 0, y: 0 },
    bounds: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  };

  get gridBoolean() {
    const { multiple, length } = this.props;
    return multiple && length > 1;
  }
  get grids() {
    const gridBoolean = this.gridBoolean;
    const grids: any = gridBoolean
      ? {
          xs: 12,
          sm: 6,
          md: 3,
          lg: 6,
          xl: 6,
        }
      : {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        };
    return grids;
  }

  /* componentWillReceiveProps(props: AllProps) {
    setTimeout(() => {
      this.bounds(props);
    }, 500);
  }

  componentDidMount() {
    this.bounds(this.props);
  }

  bounds = (props: AllProps) => {
    const { width } = props;
    const position = props.position + 1;
    const grids = this.grids;
    let numberGrids: number;
    if (!this.gridBoolean) {
      numberGrids = 12;
    } else {
      numberGrids = grids[width as keyof typeof grids];
    }
    const columns = 12 / numberGrids;
    const rows = Math.round(props.length / columns) || columns;
    const a = position % columns || columns;
    const b = Math.round(position / columns) || 1;
    let { offsetHeight: bottom, offsetWidth: right } = props.gridRef()
      .current || {
      offsetHeight: 0,
      offsetWidth: 0,
    };
    let left = 0;
    let top = 0;
    const { current } = this.gridRef;
    if (current) {
      const { offsetHeight, offsetWidth } = current;
      top = -bottom + offsetHeight + offsetHeight * (rows - b);
      bottom = bottom - offsetHeight * b;
      left = -right + offsetWidth + offsetWidth * (columns - a);
      right = right - offsetWidth * a;
      this.setState({
        bounds: {
          bottom,
          right,
          left,
          top,
        },
      });
    }
  }; */

  render() {
    const { value, deleteFile, classes, position: id } = this.props;
    const { loading, hide } = this.state;
    return (
      <Grid
        item
        container
        {...this.grids}
        className={clsx(
          classes.gridFile,
          hide && classes.gridHideTransition,
          hide && classes.gridHide,
        )}
      >
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
          />
        </Grow>
        {loading && (
          <div className={classes.loading}>
            <Loading size={40} />
          </div>
        )}
      </Grid>
    );
  }
}

export default compose<AllProps, Props>(withStyles(styles))(
  FileContainer,
);
