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
      width: 220,
      height: 125,
      margin: theme.spacing(3),
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
    text: {
      position: 'absolute',
      top: 0,
      padding: theme.spacing(2),
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
            style={{
              bottom: '5px',
            }}
          >
            <Typography
              className={classes.text}
              variant="h6"
              noWrap
              style={{
                zIndex: 10000,
              }}
            >
              {value instanceof File
                ? value.name
                : (value.file && value.file.name) || ''}
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
