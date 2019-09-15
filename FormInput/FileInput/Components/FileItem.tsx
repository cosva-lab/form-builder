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
import { Value, PropsGetThumbnail } from '../Props';

const styles = (theme: Theme) =>
  createStyles({
    image: {
      width: 220,
      height: 125,
      margin: theme.spacing(2),
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
  });

interface Props extends WithStyles<typeof styles> {
  getThumbnail: React.ReactType<PropsGetThumbnail>;
  value: Value;
  deleteFile: () => void;
}

class FileItem extends React.PureComponent<Props> {
  render() {
    const { props } = this;
    const { classes } = props;
    const { value, invalid } = this.props.value;
    return (
      <Box
        p={{
          xs: '1em',
        }}
        component={Paper}
        position={'relative'}
        style={{
          overflow: 'hidden',
        }}
        width={'100%'}
      >
        <Grid
          container
          spacing={4}
          style={{
            position: 'relative',
          }}
        >
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
              {value instanceof File ? value.name : ''}
            </Typography>
          </Box>

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
              color="inherit"
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
      </Box>
    );
  }
}

export default withStyles(styles)(FileItem);
