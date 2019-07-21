import React from 'react';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { Value } from './Props';
import { ListFiles } from './ListFiles';

const duration = 800;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      width: 220,
      height: 125,
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
  }),
);

interface Props extends Pick<ListFiles, 'getThumbnail'> {
  value: Value;
  deleteFile: () => void;
  length: number;
  multiple: boolean | undefined;
}

export const FileItem = (props: Props) => {
  const classes = useStyles();
  const [hide, set] = React.useState(false);
  const [isHide, setIsHide] = React.useState(false);

  const children = React.createRef<HTMLDivElement>();
  const { file, invalid } = props.value;
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
      }, 10);
    }, duration + (duration * 1) / 100);
  }
  if (!isHide)
    return (
      <Grid
        item
        {...(props.multiple && props.length > 1
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
          <Box
            p={{
              xs: '1em',
            }}
            component={props => <Paper {...props} />}
            position={'relative'}
            style={{
              overflow: 'hidden',
            }}
          >
            <Grid
              container
              spacing={4}
              style={{
                position: 'relative',
              }}
            >
              <Grid item container xs={12} justify="center">
                <Box
                  component={props => (
                    <Grid {...props} container justify="center" />
                  )}
                  bottom={'5px'}
                >
                  <Typography
                    variant="subtitle2"
                    noWrap
                    style={{
                      zIndex: 10000,
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {file.name}
                  </Typography>
                </Box>
                <Grid container className={classes.image}>
                  {props.getThumbnail(file, {
                    invalid: invalid,
                  })}
                </Grid>
                <Box
                  component={props => (
                    <Grid {...props} container justify="center" />
                  )}
                  bottom={'5px'}
                  position="absolute"
                >
                  <Fab
                    size="medium"
                    color="inherit"
                    onClick={e => {
                      e.preventDefault();
                      !invalid && props.deleteFile();
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </Fab>
                </Box>
              </Grid>
              {invalid && (
                <div
                  style={{
                    cursor: 'not-allowed',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    margin: 0,
                    alignItems: 'stretch',
                    opacity: 0.7,
                    background: '#ffc8c8',
                  }}
                />
              )}
            </Grid>
          </Box>
        </Grow>
      </Grid>
    );
  else return null;
};
