import React, { CSSProperties } from 'react';
import uuid from 'uuid';
import { lookup } from 'mime-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Zoom from '@material-ui/core/Zoom';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import compose from 'recompose/compose';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
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
import createStyles from '@material-ui/core/styles/createStyles';
import { FormInputProps } from '..';

const PaperStyled: any = styled(Paper)(spacing);

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
  },
});

const DefaultImage = ({ classes }: WithStyles<typeof styles>) => (
  <div className={classes.img}>
    <Typography
      style={{
        color: 'rgba(51,51,51,0.4)',
      }}
      align="center"
      component={
        BrokenImageIcon as React.ElementType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      /* className="cosva-farm" */
      variant="h1"
    />
  </div>
);

interface Props extends FormInputProps, WithStyles<typeof styles> {}
interface States {
  fileName: string;
  value: {
    file: File;
    id: string;
  }[];
  styles: CSSProperties;
}

const defaultPropsExtra = {
  accept: '*',
  extensions: ['.*'],
  validateExtensions: true,
  validateAccept: true,
  multiple: true,
  subLabel: {
    message: '',
    ns: '',
    props: {},
  },
};
class FileInput extends React.PureComponent<Props, States> {
  public inputOpenFileRef: React.RefObject<any> = React.createRef();

  public state: States = { fileName: '', value: [], styles: {} };

  static defaultProps = {
    extraProps: defaultPropsExtra,
  };

  animation = true;

  blurBool = true;

  cmponentDidUpdate(newProps: Props) {
    const state = this.props.error!.state;

    const stateProps = newProps.error!.state;

    if (stateProps !== state) {
      this.animation = true;
    }
  }

  OpenFileDialog = () => {
    this.inputOpenFileRef.current!.click();
  };

  handleChange = (target: {
    files: FileList | null;
    value?: any;
  }) => {
    this.setState(
      ({ value }) => {
        const { name } = target.files![0];
        return {
          fileName: name,
          value: [
            ...value,
            ...Array.from(target.files || []).map(file => ({
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

  deleteFile = (index: any) => {
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

  convertToRegex(param: string) {
    return new RegExp(`${param}(?=(?:[^"]*"[^"]*")*(?![^"]*"))`);
  }

  convertAccept(param: string | string[]): string[] {
    let accept = param;
    if (typeof accept === 'string') {
      if (this.convertToRegex(',').test(accept)) {
        accept = [...accept.split(',')];
      } else if (this.convertToRegex('|').test(accept)) {
        if (Array.isArray(accept)) {
          accept = [...accept.join('').split('|')];
        } else {
          accept = [...accept.split('|')];
        }
      }
    }
    return accept as string[];
  }

  validateFile(fileName: string): boolean {
    const {
      validateExtensions = true,
      validateAccept = true,
      accept: acceptFiles = '*',
      extensions = ['*'],
    } = this.props!.extraProps || {
      validateExtensions: true,
      validateAccept: true,
      extensions: ['*'],
    };
    const accept = this.convertAccept(acceptFiles);
    const hasExtensions = (): boolean =>
      new RegExp(
        `(${extensions.join('|').replace(/\./g, '\\.')})$`,
      ).test(fileName.toLowerCase());

    const acceptValidate = () =>
      Boolean(
        accept.find(
          (a: string): boolean => {
            if (!lookup(fileName)) return false;
            return !!(lookup(fileName) || '').match(
              new RegExp(`${a.replace(/(\.\*|\.|\*)$/, '')}.*`),
            );
          },
        ),
      );

    if (validateExtensions && validateAccept) {
      return hasExtensions() && acceptValidate();
    }
    if (validateExtensions && !validateAccept) {
      return hasExtensions();
    }
    if (!validateExtensions && validateAccept) {
      return acceptValidate();
    }
    return true;
  }

  getExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  getThumbnail(
    file: File,
    { invalid }: { invalid: boolean },
  ): React.ReactNode {
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

  preventDefault = (evt: React.DragEvent<HTMLElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  render() {
    const {
      classes,
      error,
      label,
      validateField,
      ns,
      extraProps,
    } = this.props;
    const { multiple, subLabel } = extraProps || defaultPropsExtra;

    const {
      message: messageSubLabel = '',
      ns: nsSubLabel = ns,
      props: propsSubLabel = {},
    } = subLabel || defaultPropsExtra.subLabel;

    const accept = this.convertAccept(defaultPropsExtra.accept);
    const { styles, value } = this.state;

    const { state, message, ns: nsError, props } = error || {
      state: false,
      message: '',
      ns: ns,
      props: {},
    };

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
                validateField();
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
                value.length === 0 ? this.OpenFileDialog : undefined
              }
              style={{
                minHeight: '170px',
                padding: '20px',
                ...(styles as any),
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
                      variant="h2"
                      component={
                        CloudUploadIcon as React.ElementType<
                          React.HTMLAttributes<HTMLElement>
                        >
                      }
                    />
                    <Typography
                      style={{
                        color: 'rgba(51,51,51,0.4)',
                      }}
                      align="center"
                      variant="h5"
                    >
                      {label}
                    </Typography>
                    <Typography
                      style={{
                        color: 'rgba(51,51,51,0.4)',
                      }}
                      align="center"
                      variant="h6"
                    >
                      {getMessage({
                        message: `${messageSubLabel}`,
                        ns: nsSubLabel,
                        styles: { top: '-8px', position: 'absolute' },
                        props: propsSubLabel,
                      })}
                    </Typography>
                  </React.Fragment>
                )}
                {value.length > 0 && (
                  <React.Fragment>
                    <Grid container spacing={4} alignItems="stretch">
                      {value.map(
                        (
                          { file, id }: any,
                          key: string | number | undefined,
                        ) => {
                          const { name: nameFile } = file;
                          const invalid = !this.validateFile(
                            nameFile,
                          );
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
                                    spacing={4}
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
                                            margin: 0,
                                            alignItems: 'stretch',
                                            opacity: 0.7,
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
                        },
                      )}
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          </Paper>
          <Grid container onClick={this.OpenFileDialog}>
            <input
              ref={this.inputOpenFileRef}
              onChange={({ target }) => {
                this.handleChange(target);
              }}
              accept={accept.join(',')}
              style={{
                display: 'none',
              }}
              multiple={multiple}
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
              {getMessage({ message: message, ns: nsError, props })}
            </FormHelperText>
          </Animation>
        )}
      </React.Fragment>
    );
  }
}

export default compose<Props, {}>(
  withStyles(styles, { name: 'FileInput' }),
)(FileInput);
