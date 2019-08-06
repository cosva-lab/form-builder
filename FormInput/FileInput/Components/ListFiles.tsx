import React from 'react';
import compose from 'recompose/compose';
import {
  ButtonBase,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

import { getMessage } from '../../../../MessagesTranslate/Animation';
import { transformLabel } from '../../../utils/transformLabel';
import {
  handleChangeFiles,
  ListFilesProps,
  ListFilesStates,
  Lookup,
} from '../Props';
import FileContainer from './FileContainer';

const styles = () => createStyles({});

const defaultPropsExtra = {
  subLabel: {
    message: '',
    ns: '',
    props: {},
  },
};

interface Props extends ListFilesProps {
  ns: string | undefined;
  name: string;
  multiple: boolean | undefined;
  changeField: handleChangeFiles;
  lookup?: Lookup;
}

declare type AllProps = Props & WithStyles<typeof styles>;

export class ListFiles extends React.PureComponent<
  AllProps,
  ListFilesStates
> {
  static defaultProps = defaultPropsExtra;
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
      files,
      changeField,
      openFileDialog,
      deleteFile,
      multiple,
      lookup,
    } = this.props;

    const isEmpty = !files.length;

    return (
      <Paper elevation={0}>
        <Grid
          ref={this.gridRef}
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
              changeField({
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
          {!isEmpty && (
            <Grid container spacing={2}>
              {files.map(file => (
                <FileContainer
                  key={file.id}
                  {...{
                    deleteFile,
                    length: files.length,
                    multiple,
                    value: file,
                    lookup,
                  }}
                />
              ))}
            </Grid>
          )}
          {isEmpty && (
            <Grid item xs={12}>
              <React.Fragment>
                <Typography
                  style={{
                    width: '100%',
                    color: 'rgba(51,51,51,0.4)',
                  }}
                  align="center"
                  variant="h2"
                  component={CloudUploadIcon as any}
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
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  }
}

export default compose<AllProps, Props>(
  withStyles(styles, { name: 'List' }),
)(ListFiles);
