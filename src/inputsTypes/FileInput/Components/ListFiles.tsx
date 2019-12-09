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
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
} from 'react-sortable-hoc';

import { getMessage } from '../../../FieldTranslate';
import { transformLabel } from '../../../utils/transformLabel';
import {
  handleChangeFiles,
  ListFilesProps,
  ListFilesStates,
} from '../Props';
import FileContainer from './FileContainer';
import withWidth, { WithWidth } from '@material-ui/core/withWidth';
import { FileValue, ActionsFiles } from '../Props';
import RootRef from '@material-ui/core/RootRef';
import { Theme } from '@material-ui/core/styles';
import { observer } from 'mobx-react';

const styles = (theme: Theme) =>
  createStyles({
    gridFileHelperClass: {
      zIndex: theme.zIndex.modal + 1,
      cursor: 'move',
      position: 'relative',
    },
    root: {
      position: 'relative',
    },
    gridFileEmpity: {
      color: theme.palette.text.hint,
    },
  });

const defaultPropsExtra = {
  subLabel: {
    message: '',
    ns: '',
    props: {},
  },
};

interface Props extends ListFilesProps, Pick<ActionsFiles, 'onSort'> {
  ns: string | undefined;
  name: string;
  multiple: boolean | undefined;
  changeField: handleChangeFiles;
}

declare type AllProps = Props & WithStyles<typeof styles> & WithWidth;

const SortableItem = sortableElement(
  (props: {
    position: number;
    length: number;
    value: FileValue;
    multiple?: boolean;
    deleteFile: (
      index: number,
      sendChange?: boolean,
    ) => Promise<void>;
  }) => <FileContainer {...props} />,
);

const SortableList = sortableContainer(
  ({
    files,
    deleteFile,
    multiple,
  }: {
    files: FileValue[];
    multiple?: boolean;
    deleteFile: (
      index: number,
      sendChange?: boolean,
    ) => Promise<void>;
  }) => {
    return (
      <Grid container spacing={2}>
        {files.map((value, index) => {
          let key = `${index}`;
          if (value.url) {
            key = value.url;
          } else if (value.file) {
            const { name, lastModified, size } = value.file;
            key = `${name}-${lastModified}-${size}`;
          }
          return (
            <SortableItem
              key={`file-${key}`}
              index={index}
              {...{
                position: index,
                deleteFile,
                length: files.length,
                multiple,
                value,
              }}
            />
          );
        })}
      </Grid>
    );
  },
);

@observer
export class ListFiles extends React.Component<
  AllProps,
  ListFilesStates
> {
  static defaultProps = defaultPropsExtra;
  private gridRef = React.createRef<HTMLElement>();

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
      changeField,
      openFileDialog,
      deleteFile,
      multiple,
      children,
      classes,
      width,
    } = this.props;
    const files =
      (this.props.fieldProxy && this.props.fieldProxy.value) ||
      this.props.files;

    const isEmpty = !files.length;

    return (
      <Paper elevation={0} className={classes.root}>
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
                changeField({
                  files: filesTransfer,
                });
                e.dataTransfer.clearData();
              }
              this.setBackgroundColor('');
            })}
            container
            component={isEmpty ? (ButtonBase as any) : undefined}
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
              <SortableList
                {...{
                  axis: 'xy',
                  deleteFile,
                  multiple,
                  files,
                  helperClass: classes.gridFileHelperClass,
                  onSortEnd: sort => {
                    const { oldIndex, newIndex } = sort;
                    this.props.onSort &&
                      this.props.onSort({
                        changedFiles: {
                          oldFile: files[oldIndex],
                          newFile: files[newIndex],
                        },
                        sort,
                      });
                  },
                  shouldCancelStart: e => {
                    if (e.target instanceof Element) {
                      let target = e.target;
                      let i = 0;
                      const iMax = 4;
                      while (target) {
                        const shouldCancelStart = target.attributes.getNamedItem(
                          'should-cancel-start',
                        );
                        if (
                          shouldCancelStart &&
                          shouldCancelStart.nodeValue === 'true'
                        ) {
                          return true;
                        } else {
                          if (i >= iMax) break;
                          if (target.parentElement) {
                            target = target.parentElement;
                          } else {
                            break;
                          }
                        }
                        i++;
                      }
                    }
                    return false;
                  },
                  width,
                }}
              />
            )}
            {isEmpty && (
              <Grid item xs={12} className={classes.gridFileEmpity}>
                <Typography
                  style={{
                    width: '100%',
                  }}
                  align="center"
                  variant="h2"
                >
                  <CloudUploadIcon fontSize="inherit" />
                </Typography>
                <Typography align="center" variant="h5">
                  {getMessage(transformLabel({ label, ns, name }))}
                </Typography>
                <Typography align="center" variant="h6">
                  {getMessage({
                    message: ``,
                    ns,
                    styles: {
                      top: '-8px',
                      position: 'absolute',
                    },
                    props: {},
                    ...subLabel,
                  })}
                </Typography>
              </Grid>
            )}
          </Grid>
        </RootRef>
        {children}
      </Paper>
    );
  }
}
export default compose<AllProps, Props>(
  withStyles(styles, { name: 'List' }),
  withWidth(),
)(ListFiles);
