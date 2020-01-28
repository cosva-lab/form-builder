import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import { FileValue, PropsGetThumbnail } from '../Props';

const styles = (theme: Theme) =>
  createStyles({
    image: {
      width: 'auto',
      height: 125,
      margin: theme.spacing(0, 3, 3, 3),
      alignItems: 'center',
      display: 'flex',
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
    box: {
      backgroundColor: theme.palette.background.default,
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      padding: '1em',
    },
    gridText: {
      padding: theme.spacing(2, 0, 1, 0),
    },
    text: {
      zIndex: theme.zIndex.modal * 1.5,
      maxWidth: `${theme.spacing(4)}%`,
    },
  });

interface Props extends WithStyles<typeof styles> {
  getThumbnail: React.ReactType<PropsGetThumbnail>;
  value: FileValue;
  deleteFile: () => void;
}

class FileItem extends React.PureComponent<Props> {
  render() {
    const { props } = this;
    const { classes } = props;
    const { value } = this.props;
    const invalid = value.invalid || false;

    return (
      <Paper className={classes.box}>
        <Grid
          container
          spacing={4}
          style={{
            position: 'relative',
          }}
        >
          <Grid
            container
            justify="center"
            className={classes.gridText}
          >
            <Typography
              className={classes.text}
              variant="subtitle1"
              noWrap
            >
              {(value instanceof File && value.name) ||
                (value.file && value.file.name) ||
                ''}
            </Typography>
          </Grid>

          <Grid container justify="center">
            <div className={classes.image}>
              <props.getThumbnail {...{ value, invalid, classes }} />
            </div>
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
              color="default"
              onClick={e => {
                e.preventDefault();
                !invalid && props.deleteFile();
              }}
              should-cancel-start="true"
              aria-label="delete"
            >
              <DeleteIcon />
            </Fab>
          </Box>
        </Grid>
        {invalid && (
          <div
            style={{
              top: 0,
              left: 0,
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
      </Paper>
    );
  }
}

export default withStyles(styles)(FileItem);
