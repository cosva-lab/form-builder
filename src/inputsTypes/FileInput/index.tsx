import React from 'react';
import { observer } from 'mobx-react';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import arrayMove from 'array-move';

import { Animation } from '../../FieldTranslate';
import {
  FileInputProps,
  handleChangeFiles,
  FileValue,
  ActionsFiles,
  Files,
} from './Props';
import ListFiles from './Components/ListFiles';
import { ExtraProps } from '../..';
import { Loading } from './Loading';
import { RenderErrorsDefault } from '../../RenderErrorsDefault';

const defaultPropsExtra = {
  validateExtensions: true,
  validateAccept: true,
  multiple: true,
  subLabel: undefined,
};

interface State {
  valueTemp: Files;
  inputValue: string;
  loading: boolean;
}

@observer
class FileInput extends React.PureComponent<FileInputProps, State> {
  static defaultProps = {
    extraProps: defaultPropsExtra,
    onAdd: null,
    onDelete: null,
  };

  private inputOpenFileRef: React.RefObject<any> = React.createRef();
  private isOpen = false;
  private isMount = true;

  state = {
    valueTemp: [],
    inputValue: '',
    loading: false,
  };

  componentWillUnmount() {
    this.isMount = false;
  }

  componentDidMount() {
    this.isMount = true;
  }

  setFiles = (value: FileValue[] = []): FileValue[] =>
    value.slice().sort((...v) => {
      const { sort } = this.propsParse;
      const res = sort && sort(...v);
      return typeof res === 'number' ? res : 0;
    });

  get extraProps(): ExtraProps {
    return {
      ...defaultPropsExtra,
      ...this.propsParse.extraProps,
    };
  }

  get propsParse() {
    return { ...this.props, ...this.props.fieldProxy };
  }

  getRegex(extensions?: string[]): RegExp | undefined {
    let regExp = undefined;
    try {
      return new RegExp(
        `(${(extensions || []).join('|').replace(/\./g, '\\.')})$`,
      );
    } catch (e) {
      regExp = undefined;
    }
    return regExp;
  }

  openFileDialog = () => {
    if (this.inputOpenFileRef) this.inputOpenFileRef.current.click();
  };

  setChangeField = (value: FileValue[], callBack?: () => void) => {
    const { changeField, name } = this.propsParse;
    changeField &&
      changeField(
        {
          target: {
            name,
            value,
          },
        },
        callBack,
      );
  };

  changeField: handleChangeFiles = async ({ files }) => {
    if (files && files.length) {
      let newValue: FileValue[] = [];
      const valueTemp: FileValue[] = [];
      const tempFiles = Array.from(files);

      this.setState({
        loading: true,
      });

      this.setState({
        loading: false,
      });

      for (const file of tempFiles) {
        const { value } = this.propsParse;
        if (
          value.some(({ file: tempFile }) => {
            if (!tempFile) return false;
            const { type, name, size } = tempFile;
            return (
              type === file.type &&
              name === file.name &&
              size === file.size
            );
          })
        )
          continue;

        const va: FileValue = {
          url: URL.createObjectURL(file),
          file,
          invalid: false,
        };
        if (!this.validateFile(file)) {
          va.invalid = true;
          valueTemp.push(va);
        } else {
          newValue.push(va);
        }
      }

      const { onAdd } = this.propsParse;
      let callBack: (() => void) | undefined = undefined;

      if (onAdd) {
        const call = onAdd(newValue);
        if (call instanceof Promise) {
          let userErr;
          this.setState({ loading: true });
          if (this.isMount) {
          }
          await call
            .then(res => {
              if (res) {
                let value;
                if (Array.isArray(res)) value = res;
                else if (typeof res === 'object') {
                  callBack = res.callBack;
                  if (Array.isArray(res.value)) value = res.value;
                }
                if (value) {
                  newValue = [];
                  for (const file of this.setFiles(value)) {
                    if (!(file instanceof File) && !file.invalid)
                      newValue = [...newValue, file];
                    else valueTemp.push(file);
                  }
                }
              }
            })
            .catch(err => (userErr = err));
          if (!callBack) callBack = () => {};
          if (this.isMount) this.setState({ loading: false });
          if (userErr) throw userErr;
        }
      }
      if (valueTemp.length) {
        setTimeout(() => {
          this.clearValueTemp();
        }, 3000);
      }

      if (this.isMount) {
        this.setState(
          {
            valueTemp,
            inputValue: '',
          },
          () => {
            this.setChangeField(
              [...this.propsParse.value, ...newValue],
              callBack,
            );
          },
        );
      } else {
        callBack && callBack();
      }
    }
  };

  onSort: Required<ActionsFiles>['onSort'] = async ({
    changedFiles,
    sort,
  }) => {
    const { oldIndex, newIndex } = sort;
    const { onSort } = this.propsParse;
    let callBack: (() => void) | undefined = undefined;
    const oldValue = this.propsParse.value;
    if (oldIndex === newIndex) return;
    const files = (this.propsParse.arrayMove || arrayMove)(
      [...oldValue],
      oldIndex,
      newIndex,
    );
    if (this.isMount) {
      this.setChangeField(files);
    }
    let userErr: any;
    if (onSort) {
      const call = onSort({ changedFiles, sort });
      if (call instanceof Promise) {
        this.setState({
          loading: true,
        });
        await call
          .then(result => {
            if (result) {
              callBack = result.callBack;
            }
          })
          .catch(e => {
            userErr = e;
          });
      } else if (call) {
        callBack = call.callBack;
      }
    }

    if (this.isMount) {
      const setChangeField = () => {
        if (userErr)
          this.setChangeField(oldValue, () => {
            callBack && callBack();
          });
        else callBack && callBack();
      };
      if (this.state.loading)
        this.setState(
          {
            loading: false,
          },
          setChangeField,
        );
      else setChangeField();
    } else {
      callBack && callBack();
    }
  };

  deleteFile = async (index: number, sendChange = true) => {
    const file = this.propsParse.value.find((_s, id) => id === index);
    const { onDelete } = this.propsParse;
    let callBack: (() => void) | undefined = undefined;

    if (sendChange && file && onDelete) {
      const call = onDelete([file]);
      if (call instanceof Promise) {
        let userErr;
        call.catch(err => (userErr = err));
        const res = await call;
        if (res && typeof res.callBack === 'function') {
          callBack = res.callBack;
        }
        if (userErr) throw userErr;
      } else if (call && typeof call.callBack === 'function') {
        callBack = call.callBack;
      }
    }

    if (this.isMount) {
      const value = this.propsParse.value;
      value.splice(index, 1);
      this.setState({ valueTemp: [] }, () => {
        this.setChangeField(value, callBack);
      });
    } else {
      callBack && callBack();
    }
  };

  convertToRegex(param: string) {
    return new RegExp(`${param}(?=(?:[^"]*"[^"]*")*(?![^"]*"))`);
  }

  clearValueTemp = () => {
    this.setState({ valueTemp: [] });
  };

  convertAccept(param?: string | string[]): string[] {
    let accept: string[] = [];
    if (typeof param === 'string') {
      if (this.convertToRegex(',').test(param)) {
        accept = [...param.split(',')];
      } else if (this.convertToRegex('|').test(param)) {
        if (Array.isArray(param)) {
          accept = [...accept.join('').split('|')];
        } else {
          accept = [...param.split('|')];
        }
      } else {
        accept = [param];
      }
    } else if (param) {
      accept = param;
    }
    return accept;
  }

  validateFile: (file: File) => boolean = file => {
    const {
      validateExtensions,
      validateAccept,
      accept: acceptFiles,
      extensions,
    } = this.extraProps;

    const accept = this.convertAccept(acceptFiles);
    const acceptValidate = () =>
      !!(
        accept.find((a: string): boolean => {
          if (!file.type) return false;
          return !!(file.type || '').match(
            new RegExp(`${a.replace(/(\.\*|\.|\*)$/, '')}.*`),
          );
        }) ||
        '*' === acceptFiles ||
        !acceptFiles
      );

    const hasExtensions = (): boolean => {
      const regex = this.getRegex(extensions);
      if (regex) return regex.test(file.name.toLowerCase());
      return true;
    };

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
  };

  getExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  public render() {
    const { fieldProxy } = this.props;
    const {
      errors,
      label,
      name,
      value,
      renderErrors: RenderErrors,
    } = this.propsParse;
    const ns = fieldProxy.ns;
    const { multiple, subLabel } = this.extraProps;
    const accept = this.convertAccept(this.extraProps.accept);
    const { valueTemp, inputValue, loading } = this.state;
    const files: FileValue[] = value;
    return (
      <>
        <Paper
          elevation={!files.length ? 1 : 0}
          style={{
            position: 'relative',
            padding: '1em',
            borderBottom:
              errors || valueTemp.length
                ? '2px solid #f44336'
                : undefined,
          }}
        >
          <ListFiles
            {...{
              label,
              ns,
              name,
              files,
              multiple,
              subLabel,
              fieldProxy,
              valueTemp,
              changeField: (...value) => this.changeField(...value),
              openFileDialog: (...value) =>
                this.openFileDialog(...value),
              deleteFile: (...value) => this.deleteFile(...value),
              onSort: value => this.onSort(value),
            }}
          >
            {loading && <Loading />}
          </ListFiles>
          <Grid container onClick={() => this.openFileDialog()}>
            <input
              ref={this.inputOpenFileRef}
              onChange={({ target }) => {
                this.changeField(target);
              }}
              onClick={e => {
                if (!this.isOpen) {
                  setTimeout(() => {
                    this.isOpen = false;
                  });
                  this.isOpen = true;
                } else {
                  e.preventDefault();
                }
              }}
              accept={accept.join(',')}
              style={{
                display: 'none',
              }}
              value={inputValue}
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
        {errors && (
          <Animation>
            {(RenderErrors && (
              <RenderErrors {...{ errors, fieldProxy }} />
            )) || (
              <FormHelperText
                error={true}
                variant="outlined"
                style={{
                  margin: '0',
                  marginTop: '8px',
                }}
                component="div"
              >
                <RenderErrorsDefault {...{ errors, fieldProxy }} />
              </FormHelperText>
            )}
          </Animation>
        )}
      </>
    );
  }
}

export { FileInput };
export default FileInput;
