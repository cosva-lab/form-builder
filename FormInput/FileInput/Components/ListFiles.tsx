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

import { getMessage } from '../../../../MessagesTranslate/Animation';
import { transformLabel } from '../../../utils/transformLabel';
import {
  handleChangeFiles,
  ListFilesProps,
  ListFilesStates,
} from '../Props';
import FileContainer from './FileContainer';
import withWidth, { WithWidth } from '@material-ui/core/withWidth';
import { Value, ActionsFiles } from '../Props';
import RootRef from '@material-ui/core/RootRef';
import { Theme } from '@material-ui/core/styles';
import arrayMove from 'array-move';

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
    value: Value;
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
    files: Value[];
    multiple?: boolean;
    deleteFile: (
      index: number,
      sendChange?: boolean,
    ) => Promise<void>;
  }) => {
    return (
      <Grid container spacing={2}>
        {files.map((value, index) => (
          <SortableItem
            key={`item-${value.id}`}
            index={index}
            {...{
              position: index,
              deleteFile,
              length: files.length,
              multiple,
              value,
            }}
          />
        ))}
      </Grid>
    );
  },
);

export class ListFiles extends React.PureComponent<
  AllProps,
  ListFilesStates
> {
  static defaultProps = defaultPropsExtra;
  private gridRef = React.createRef<HTMLElement>();

  state = {
    backgroundColor: '',
    files: this.props.files,
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

  UNSAFE_componentWillReceiveProps(newProps: AllProps) {
    this.setState({ files: newProps.files });
  }

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
    const { files } = this.state;

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
                    this.setState(
                      {
                        files: arrayMove(
                          [...files],
                          oldIndex,
                          newIndex,
                        ),
                      },
                      () => {
                        this.props.onSort &&
                          this.props.onSort({
                            changedFiles: {
                              oldFile: files[oldIndex].value,
                              newFile: files[newIndex].value,
                            },
                            sort,
                          });
                      },
                    );
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
