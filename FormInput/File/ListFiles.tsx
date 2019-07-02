import React from 'react';
import Zoom from '@material-ui/core/Zoom';
import Grow from '@material-ui/core/Grow';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import { getMessage } from '../../../MessagesTranslate/Animation';
import { transformLabel } from '../../utils/transformLabel';
import {
  handleChangeFiles,
  ListFilesProps,
  Value,
  ListFilesStates,
} from './Props';
import { DefaultImage } from './DefaultImage';

class ListFiles extends React.Component<
  {
    ns: string | undefined;
    name: string;
    multiple: boolean | undefined;
    classes: Record<'img' | 'progress' | 'image', string>;
    handleChange: handleChangeFiles;
  } & ListFilesProps,
  ListFilesStates
> {
  state = {
    backgroundColor: '',
  };

  preventDefault = (evt: React.DragEvent<HTMLElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  getThumbnail(
    file: File,
    { invalid }: { invalid: boolean },
  ): React.ReactNode {
    const { classes } = this.props;
    const { name } = file;
    if (invalid) {
      return <DefaultImage {...{ classes }} />;
    }
    switch (this.props.lookup(name)) {
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

  render() {
    const {
      label,
      ns,
      name,
      subLabel,
      value,
      multiple,
      classes,
      handleChange,
      openFileDialog,
      validateFile,
      deleteFile,
    } = this.props;

    const { backgroundColor } = this.state;

    let isEmpty = false;
    if (value === null) {
      isEmpty = true;
    } else {
      if (Array.isArray(value)) {
        if (!value.length) {
          isEmpty = true;
        }
      } else {
        if (!(value!.file instanceof File)) {
          isEmpty = true;
        }
      }
    }
    const files: Value[] = value
      ? Array.isArray(value)
        ? value
        : [value]
      : [];

    const {
      message: messageSubLabel = '',
      ns: nsSubLabel = ns,
      props: propsSubLabel = {},
    } = subLabel;

    return (
      <Paper elevation={0}>
        <Grid
          onDragEnter={this.preventDefault}
          onDragLeave={e => {
            this.setState({
              backgroundColor: '',
            });
            this.preventDefault(e);
          }}
          onDragOver={e => {
            this.preventDefault(e);
            if (!backgroundColor) {
              this.setState({
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              });
            }
          }}
          onDrop={e => {
            this.preventDefault(e);
            const { files: filesTransfer } = e.dataTransfer;
            if (filesTransfer && filesTransfer.length > 0) {
              handleChange({
                files: filesTransfer,
              });
              e.dataTransfer.clearData();
            }
            this.setState({
              backgroundColor: '',
            });
          }}
          container
          component={isEmpty ? ButtonBase : undefined}
          onClick={isEmpty ? openFileDialog : undefined}
          style={{
            minHeight: '170px',
            padding: '20px',
            backgroundColor,
          }}
          alignContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            {isEmpty && (
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
                  {getMessage(transformLabel({ label, ns, name }))}
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
                    styles: {
                      top: '-8px',
                      position: 'absolute',
                    },
                    props: propsSubLabel,
                  })}
                </Typography>
              </React.Fragment>
            )}
            {!isEmpty && (
              <React.Fragment>
                <Grid container spacing={4} alignItems="stretch">
                  {files.map(
                    (
                      { file, id }: any,
                      key: string | number | undefined,
                    ) => {
                      const { name: nameFile } = file;
                      const invalid = !validateFile(nameFile);
                      return (
                        <Grid
                          // eslint-disable-next-line react/no-array-index-key
                          key={key}
                          item
                          {...(multiple && files.length > 1
                            ? { sm: 6, md: 6, lg: 6, xs: true }
                            : { xs: 12 })}
                        >
                          <Grow in>
                            <Box
                              p={{
                                xs: '1em',
                              }}
                              component={props => (
                                <Paper {...props} />
                              )}
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
                                <Grid
                                  item
                                  container
                                  xs={12}
                                  justify="center"
                                >
                                  <Grid
                                    container
                                    className={classes.image}
                                  >
                                    {this.getThumbnail(file, {
                                      invalid,
                                    })}
                                  </Grid>
                                  <Box
                                    component={props => (
                                      <Grid
                                        {...props}
                                        container
                                        justify="center"
                                      />
                                    )}
                                    onClick={e => {
                                      e.preventDefault();
                                      deleteFile(id);
                                    }}
                                    bottom={'5px'}
                                    position="absolute"
                                  >
                                    <Fab
                                      size="medium"
                                      color="inherit"
                                      aria-label="delete"
                                    >
                                      <DeleteIcon />
                                    </Fab>
                                  </Box>
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
                              </Grid>
                            </Box>
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
    );
  }
}

export default ListFiles;
