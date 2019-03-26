import React from 'react';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  spacing,
  palette,
  sizing,
  flexbox,
  display,
  positions,
} from '@material-ui/system';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  getMessage,
  Animation,
} from '../../MessagesTranslate/Animation';

export const PaperStyled = styled(Paper)(
  spacing,
  palette,
  sizing,
  flexbox,
  display,
  positions,
);

const styles = () => ({
  image: {
    width: 220,
    height: 125,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

class File extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    autoComplete: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    error: PropTypes.object,
    InputProps: PropTypes.object,
    classes: PropTypes.object,
    waitTime: PropTypes.bool,
    multiple: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    validateField: PropTypes.func,
  };

  state = { fileName: '', value: [], styles: {} };

  animation = true;

  blurBool = true;

  componentDidUpdate(newProps) {
    const { state } = newProps.error;
    const { state: stateProps } = this.props.error;
    if (stateProps !== state) {
      this.animation = true;
    }
  }

  inputOpenFileRef = React.createRef();

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  handleChange = target => {
    this.setState(
      ({ value }) => {
        const { name } = target.files[0];
        return {
          fileName: name,
          value: [...value, ...Array.from(target.files)],
        };
      },
      () => {
        const { handleChange, name, type } = this.props;
        handleChange({
          target: { name, value: this.state.value, type },
          waitTime: false,
        });
        // eslint-disable-next-line no-param-reassign
        target.value = '';
      },
    );
  };

  deleteFile = index => {
    this.setState(
      ({ value }) => ({
        value: value.filter((_file, key) => key !== index),
      }),
      () => {
        const { handleChange, name, type } = this.props;
        handleChange({
          target: { name, value: this.state.value, type },
          waitTime: false,
        });
      },
    );
  };

  render() {
    const {
      name,
      classes,
      multiple,
      type,
      error,
      handleChange,
      validateField,
    } = this.props;
    const { fileName, styles, value } = this.state;
    const { state, message, ns, attribute } = error;
    return (
      <React.Fragment>
        <Paper
          elevation={1}
          onBlur={() => {
            this.animation = false;
            this.blurBool = false;
          }}
          onFocus={() => {
            if (!this.blurBool) {
              setTimeout(() => {
                validateField({
                  waitTime: false,
                });
              }, 100);
            }
          }}
          style={{
            padding: '1em',
            borderBottom: state ? '2px solid #f44336' : undefined,
          }}
        >
          <Paper elevation={2}>
            <Grid
              onDragEnter={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={e => {
                this.setState({
                  styles: {},
                });
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragOver={e => {
                e.preventDefault();
                e.stopPropagation();
                const { backgroundColor } = this.state.styles;
                if (!backgroundColor) {
                  this.setState({
                    styles: {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  });
                }
              }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                const { files: filesTransfer } = e.dataTransfer;
                if (filesTransfer && filesTransfer.length > 0) {
                  this.handleChange({
                    files: filesTransfer,
                  });
                  e.dataTransfer.clearData();
                }
                this.setState({
                  styles: {},
                });
              }}
              container
              component={value.length === 0 ? ButtonBase : undefined}
              onClick={
                value.length === 0 ? this.showOpenFileDlg : undefined
              }
              style={{
                minHeight: '200px',
                padding: '20px',
                ...styles,
              }}
              alignContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                {value.length === 0 && (
                  <React.Fragment>
                    <Typography
                      style={{
                        width: '100%',
                        color: 'rgba(51,51,51,0.4)',
                      }}
                      align="center"
                      inline={false}
                      variant="h2"
                      component={CloudUploadIcon}
                    />
                    <Typography
                      style={{
                        color: 'rgba(51,51,51,0.4)',
                      }}
                      align="center"
                      inline={false}
                      variant="h6"
                    >
                      {'placeHolder'}
                    </Typography>
                  </React.Fragment>
                )}
                {value.length > 0 && (
                  <React.Fragment>
                    <Grid container spacing={24} alignItems="stretch">
                      {value.map((file, key) => {
                        const { name: nameFile } = file;
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <Grid key={key} item sm={6} md={4} xs>
                            <PaperStyled
                              p={{
                                xs: '1em',
                              }}
                            >
                              <Grid container spacing={16}>
                                <Grid
                                  item
                                  container
                                  xs={12}
                                  justify="center"
                                  component={ButtonBase}
                                >
                                  <Grid
                                    container
                                    className={classes.image}
                                    onClick={() => {
                                      this.setState({
                                        slideIndex: key,
                                        open: true,
                                      });
                                    }}
                                  >
                                    <img
                                      className={classes.img}
                                      alt="complex"
                                      src={URL.createObjectURL(file)}
                                    />
                                  </Grid>
                                </Grid>
                                <Grid container justify="center">
                                  <IconButton
                                    aria-label="More"
                                    aria-haspopup="true"
                                    onClick={() =>
                                      this.deleteFile(key)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </PaperStyled>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Grid container onClick={this.showOpenFileDlg}>
            <input
              ref={this.inputOpenFileRef}
              onChange={({ target }) => {
                console.log(435434);
                this.handleChange(target);
              }}
              accept="image/*"
              style={{
                display: 'none',
              }}
              id={`${name}-file`}
              multiple
              type="file"
            />
            <Button
              variant="outlined"
              component="span"
              fullWidth
              style={{ marginTop: '1em' }}
            >
              upload
            </Button>
          </Grid>
        </Paper>
        {state && (
          <Animation>
            <FormHelperText
              error={state}
              variant="outlined"
              style={{
                margin: '0',
                marginTop: '8px',
              }}
              component="div"
            >
              {getMessage(message, ns, attribute)}
            </FormHelperText>
          </Animation>
        )}
      </React.Fragment>
    );
  }
}

export default compose(withStyles(styles, { name: 'FileInput' }))(
  File,
);
