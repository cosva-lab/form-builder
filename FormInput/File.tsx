import React from 'react';
import uuid from 'uuid';
import { lookup } from 'mime-types';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Zoom from '@material-ui/core/Zoom';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import spacing from '@material-ui/system/spacing';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  getMessage,
  Animation,
} from '../../MessagesTranslate/Animation';

export const PaperStyled = styled(Paper)(spacing);

const stylesComponent = () => ({
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

const DefaultImage = ({ classes }) => (
  <div className={classes.img}>
    <Typography
      style={{
        color: 'rgba(51,51,51,0.4)',
      }}
      align="center"
      inline={false}
      component={BrokenImageIcon}
      /* className="cosva-farm" */
      variant="h1"
    />
  </div>
);
DefaultImage.propTypes = {
  classes: PropTypes.object,
};

class File extends React.PureComponent {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    extraProps: PropTypes.shape({
      subLabel: PropTypes.shape({
        message: PropTypes.string,
        ns: PropTypes.string,
        notPos: PropTypes.bool,
      }),
      message: PropTypes.string,
      props: PropTypes.object,
      accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
      ]),
      extensions: PropTypes.array,
      multiple: PropTypes.bool,
      validateExtensions: PropTypes.bool,
      validateAccept: PropTypes.bool,
    }),
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    error: PropTypes.object,
    InputProps: PropTypes.object,
    classes: PropTypes.object,
    waitTime: PropTypes.bool,
    handleChange: PropTypes.func.isRequired,
    validateField: PropTypes.func,
    ns: PropTypes.string,
  };

  static defaultProps = {
    extraProps: {
      accept: '*',
      extensions: ['.*'],
      validateExtensions: true,
      validateAccept: true,
    },
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
          value: [
            ...value,
            ...Array.from(target.files).map(file => ({
              file,
              id: uuid.v4(),
            })),
          ],
        };
      },
      () => {
        const { handleChange, name, type } = this.props;
        handleChange({
          target: {
            name,
            value: this.state.value.map(({ file }) => file),
            type,
          },
          waitTime: false,
        });
        // eslint-disable-next-line no-param-reassign
        target.value = '';
        this.state.value.forEach(({ file, id }) => {
          if (!this.validateFile(file.name)) {
            this.deleteFile(id);
          }
        });
      },
    );
  };

  deleteFile = index => {
    this.setState(
      ({ value }) => ({
        value: value.filter(({ id }) => id !== index),
      }),
      () => {
        const { handleChange, name, type } = this.props;
        handleChange({
          target: {
            name,
            value: this.state.value.map(({ file }) => file),
            type,
          },
          waitTime: false,
        });
      },
    );
  };

  convertToRegex(param) {
    return new RegExp(`${param}(?=(?:[^"]*"[^"]*")*(?![^"]*"))`);
  }

  convertAccept(param) {
    let accept = param;
    if (typeof accept === 'string') {
      if (this.convertToRegex(',').test(accept)) {
        accept = [...accept.split(',')];
      }
      if (this.convertToRegex('|').test(accept)) {
        if (Array.isArray(accept)) {
          accept = [...accept.join('').split('|')];
        } else {
          accept = [...accept.split('|')];
        }
      }
    }
    return accept;
  }

  validateFile(fileName) {
    const { extraProps } = this.props;
    const {
      validateExtensions = true,
      validateAccept = true,
      extensions,
    } = extraProps;
    const accept = this.convertAccept(extraProps.accept);

    const hasExtensions = () =>
      new RegExp(
        `(${extensions.join('|').replace(/\./g, '\\.')})$`,
      ).test(fileName.toLowerCase());

    const acceptValidate = () =>
      Boolean(
        accept.find(a => {
          if (!lookup(fileName)) return false;
          return lookup(fileName).match(
            new RegExp(`${a.replace(/(\.\*|\.|\*)$/, '')}.*`),
          );
        }),
      );

    if (validateExtensions && validateAccept) {
      return hasExtensions && acceptValidate();
    }
    if (validateExtensions && !validateAccept) {
      return hasExtensions;
    }
    if (!validateExtensions && validateAccept) {
      return acceptValidate();
    }
    return true;
  }

  getExtension(fileName) {
    return fileName.split('.').pop();
  }

  getThumbnail(file, { invalid }) {
    const { classes } = this.props;
    const { name } = file;
    if (invalid) {
      return <DefaultImage {...{ classes }} />;
    }
    switch (lookup(name)) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/svg+xml':
        return (
          <img
            className={classes.img}
            alt="complex"
            src={URL.createObjectURL(file)}
          />
        );
      default:
        return <DefaultImage {...{ classes }} />;
    }
  }

  preventDefault = evt => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  render() {
    const {
      classes,
      error,
      label,
      extraProps,
      validateField,
      ns,
    } = this.props;
    const { multiple, subLabel } = extraProps;

    const {
      message: messageSubLabel = '',
      ns: nsSubLabel = ns,
      props: propsSubLabel,
    } = subLabel || {};

    const accept = this.convertAccept(extraProps.accept);

    const { styles, value } = this.state;
    const { state, message, ns: nsError, props } = error;
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
          <Paper elevation={0}>
            <Grid
              onDragEnter={this.preventDefault}
              onDragLeave={e => {
                this.setState({
                  styles: {},
                });
                this.preventDefault(e);
              }}
              onDragOver={e => {
                this.preventDefault(e);
                const { backgroundColor } = styles;
                if (!backgroundColor) {
                  this.setState({
                    styles: {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  });
                }
              }}
              onDrop={e => {
                this.preventDefault(e);
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
                minHeight: '170px',
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
                      variant="h5"
                    >
                      {label}
                    </Typography>
                    <Typography
                      style={{
                        color: 'rgba(51,51,51,0.4)',
                      }}
                      align="center"
                      inline={false}
                      variant="h6"
                    >
                      {getMessage({
                        label: `${messageSubLabel}`,
                        ns: nsSubLabel,
                        styles: { top: '-8px', position: 'absolute' },
                        propsSubLabel,
                      })}
                    </Typography>
                  </React.Fragment>
                )}
                {value.length > 0 && (
                  <React.Fragment>
                    <Grid container spacing={16} alignItems="stretch">
                      {value.map(({ file, id }, key) => {
                        const { name: nameFile } = file;
                        const invalid = !this.validateFile(nameFile);
                        return (
                          <Grid
                            // eslint-disable-next-line react/no-array-index-key
                            key={key}
                            item
                            {...(multiple && value.length > 1
                              ? { sm: 6, md: 6, lg: 6, xs: true }
                              : { xs: 12 })}
                          >
                            <Grow in>
                              <PaperStyled
                                p={{
                                  xs: '1em',
                                }}
                              >
                                <Grid
                                  container
                                  spacing={16}
                                  style={{
                                    position: 'relative',
                                  }}
                                >
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
                                      {this.getThumbnail(file, {
                                        invalid,
                                      })}
                                    </Grid>
                                  </Grid>
                                  {invalid && (
                                    <Zoom in>
                                      <div
                                        style={{
                                          cursor: 'not-allowed',
                                          width: '100%',
                                          height: '100%',
                                          position: 'absolute',
                                          margin: '0',
                                          alignItems: 'stretch',
                                          opacity: '0.7',
                                          background: '#ffc8c8',
                                        }}
                                      />
                                    </Zoom>
                                  )}
                                  <Grid container justify="center">
                                    <IconButton
                                      aria-label="More"
                                      aria-haspopup="true"
                                      onClick={() =>
                                        this.deleteFile(id)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </PaperStyled>
                            </Grow>
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
                this.handleChange(target);
              }}
              accept={accept.join(',')}
              style={{
                display: 'none',
              }}
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
              {getMessage({ label: message, ns: nsError, props })}
            </FormHelperText>
          </Animation>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(stylesComponent, { name: 'FileInput' }),
)(File);
