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
} from '@material-ui/core/styles';
import { Value, PropsGetThumbnail } from '../Props';

const styles = createStyles({
  image: {
    width: 220,
    height: 125,
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
    const { file, invalid } = this.props.value;
    return (
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
                {file instanceof File ? file.name : ''}
              </Typography>
            </Box>
            <Grid container className={classes.image}>
              <props.getThumbnail {...{ file, invalid, classes }} />
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
    );
  }
}

export default withStyles(styles)(FileItem);
