import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import RootRef from '@material-ui/core/RootRef';
import compose from 'recompose/compose';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { getMessage } from '../../../MessagesTranslate/Animation';
import { transformLabel } from '../../utils/transformLabel';
import {
  handleChangeFiles,
  ListFilesProps,
  Value,
  ListFilesStates,
} from './Props';
import { DefaultImage } from './DefaultImage';
import { FileItem } from './FileItem';

export const duration = 800;
const styles = () =>
  createStyles({
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

interface Props extends ListFilesProps {
  ns: string | undefined;
  name: string;
  multiple: boolean | undefined;
  handleChange: handleChangeFiles;
  clearValueTemp: () => void;
}

declare type AllProps = Props & WithStyles<typeof styles>;

export class ListFiles extends React.Component<
  AllProps,
  ListFilesStates
> {
  private gridRef = React.createRef<HTMLDivElement>();

  state = {
    backgroundColor: '',
  };

  preventDefault = (
    callback?: (evt: React.DragEvent<HTMLElement>) => void,
  ) => {
    return (evt: React.DragEvent<HTMLElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
      callback && callback(evt);
    };
  };

  getThumbnail = (
    file: File,
    { invalid }: { invalid: boolean },
  ): React.ReactNode => {
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
  };

  setBackgroundColor = (color: string = '') => {
    if (this.gridRef.current)
      this.gridRef.current.style.backgroundColor = color;
  };

  get backgroundColor() {
    if (this.gridRef.current)
      return this.gridRef.current.style.backgroundColor || '';
    return '';
  }

  public render() {
    const {
      label,
      ns,
      name,
      subLabel,
      value,
      valueTemp,
      multiple,
      handleChange,
      openFileDialog,
      deleteFile,
      clearValueTemp,
    } = this.props;

    if (value && !value.length && valueTemp && valueTemp.length) {
      setTimeout(() => {
        clearValueTemp();
      }, duration * 2);
    }

    const files: Value[] = [...(value || []), ...(valueTemp || [])];
    const isEmpty = !files.length;

    return (
      <Paper elevation={0}>
        <RootRef rootRef={this.gridRef}>
          <Grid
            onDragEnter={this.preventDefault()}
            onDragLeave={this.preventDefault(() =>
              this.setBackgroundColor(),
            )}
            onDragOver={this.preventDefault(() =>
              this.setBackgroundColor('rgba(0, 0, 0, 0.08)'),
            )}
            onDrop={this.preventDefault(e => {
              const { files: filesTransfer } = e.dataTransfer;
              if (filesTransfer && filesTransfer.length > 0) {
                handleChange({
                  files: filesTransfer,
                });
                e.dataTransfer.clearData();
              }
              this.setBackgroundColor('');
            })}
            container
            component={isEmpty ? ButtonBase : undefined}
            onClick={isEmpty ? openFileDialog : undefined}
            style={{
              minHeight: '170px',
              padding: '20px',
              backgroundColor: this.backgroundColor,
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
                      message: ``,
                      ns: ns,
                      styles: {
                        top: '-8px',
                        position: 'absolute',
                      },
                      props: {},
                      ...subLabel,
                    })}
                  </Typography>
                </React.Fragment>
              )}
              {!isEmpty && (
                <React.Fragment>
                  <Grid container spacing={4} alignItems="stretch">
                    {files.map(file => {
                      return (
                        <FileItem
                          key={file.id}
                          getThumbnail={this.getThumbnail}
                          multiple={multiple}
                          deleteFile={() => deleteFile(file.id)}
                          value={file}
                          length={files.length}
                        ></FileItem>
                      );
                    })}
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </RootRef>
      </Paper>
    );
  }
}

export default compose<AllProps, Props>(
  withStyles(styles, { name: 'List' }),
)(ListFiles);
