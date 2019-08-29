import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getMessage,
  Animation,
} from '../../../MessagesTranslate/Animation';
import {
  AllProps,
  Props,
  State,
  handleChangeFiles,
  Value,
  FileVa,
} from './Props';
import ListFiles from './Components/ListFiles';
import { styles } from './styles';
import { MakeCancelable } from '../../../../utils/makeCancelable';

const defaultPropsExtra = {
  accept: '*',
  extensions: ['.*'],
  validateExtensions: true,
  validateAccept: true,
  multiple: true,
  subLabel: undefined,
};

class FileInput extends React.Component<AllProps, State> {
  public inputOpenFileRef: React.RefObject<any> = React.createRef();
  public animation = true;

  public blurBool = true;
  public mimeTypes?: MakeCancelable<typeof import('mime-types')>;

  static defaultProps = {
    extraProps: defaultPropsExtra,
    onAdd: null,
    onDelete: null,
  };

  constructor(props: AllProps) {
    super(props);
    const { value } = this.props;
    this.state = {
      value: this.setFiles(value),
      valueTemp: [],
      inputValue: '',
      lookup: undefined,
      loading: false,
    };
  }

  UNSAFE_componentWillMount() {
    if (this.canImportMime) {
      this.mimeTypes = new MakeCancelable(import('mime-types'));
      this.mimeTypes.promise
        .then(({ lookup }) => {
          this.setState({ lookup });
        })
        .catch(() => {});
    }
  }

  componentWillUnmount() {
    this.mimeTypes && this.mimeTypes.cancel();
  }

  setFiles(value: FileVa[] = []): Value[] {
    return value.map(
      (file): Value => {
        let temp = file;
        if (file instanceof File) {
          temp = {
            url: URL.createObjectURL(file),
            file,
          };
        }
        return {
          value: temp,
          invalid: false,
        };
      },
    );
  }

  get extraProps() {
    return {
      ...defaultPropsExtra,
      ...this.props.extraProps,
    };
  }

  get canImportMime() {
    const { accept } = this.extraProps;
    return !('*' === accept || accept === '');
  }

  validExtensions(): boolean {
    let error = false;
    const extraProps = this.extraProps;
    const extensions = extraProps.extensions;
    if (extensions) {
      try {
        new RegExp(
          `(${extensions.join('|').replace(/\./g, '\\.')})$`,
        );
      } catch (e) {
        error = true;
        console.error(e);
      }
    }
    return error;
  }

  UNSAFE_componentWillReceiveProps({ value }: AllProps) {
    const newValue = this.setFiles(value);
    if (newValue.length !== this.state.value.length) {
      this.setState({ value: newValue });
    }
  }

  componentUpdate({ error }: AllProps) {
    const { error: errorOld } = this.props;
    const stateOld = errorOld && errorOld.state;
    const stateProps = error && error.state;
    if (stateProps !== stateOld) {
      this.animation = true;
    }
  }

  openFileDialog = () => {
    if (this.inputOpenFileRef) this.inputOpenFileRef.current.click();
  };

  changeField: handleChangeFiles = async target => {
    const { files } = target;
    if (files && files[0]) {
      const { value } = this.state;
      const newFiles: File[] = [];
      const newValueBase = Array.isArray(value) ? value : [];
      let newValue = [...newValueBase];
      const valueTemp: Value[] = [];
      const tempFiles = Array.from(files);
      tempFiles.forEach(file => {
        const va: Value = {
          value: {
            url: URL.createObjectURL(file),
            file,
          },
          invalid: false,
        };
        if (!this.validateFile(file.name)) {
          va.invalid = true;
          valueTemp.push(va);
        } else {
          newFiles.push(file);
          newValue.push(va);
        }
      });

      const { onAdd } = this.props;
      let callBack: () => void;

      if (onAdd) {
        const call = onAdd(newFiles);
        if (call instanceof Promise) {
          let userErr;
          this.setState({ loading: true });
          await call
            .then(res => {
              if (res) {
                let value;
                if (Array.isArray(res)) {
                  value = res;
                } else if (
                  res &&
                  typeof res === 'object' &&
                  Array.isArray(res.value)
                ) {
                  value = res.value;
                  callBack = res.callBack;
                }
                if (value) {
                  newValue = [
                    ...newValueBase,
                    ...this.setFiles(value),
                  ];
                }
              }
            })
            .catch(err => (userErr = err));
          this.setState({ loading: false });
          if (userErr) {
            throw userErr;
          }
        }
      }
      if (valueTemp.length) {
        setTimeout(() => {
          this.clearValueTemp();
        }, 2000);
      }
      this.setState(
        {
          value: newValue,
          valueTemp,
          inputValue: '',
        },
        () => {
          const files = this.state.value;
          if (files) {
            const { changeField, name } = this.props;
            changeField &&
              changeField(
                {
                  target: {
                    name,
                    value: Array.isArray(files)
                      ? files.map(({ value }) => {
                          if (value instanceof File) {
                            return value;
                          } else {
                            if (value.file instanceof File) {
                              return value.file;
                            } else {
                              return value;
                            }
                          }
                        })
                      : [],
                  },
                },
                callBack,
              );
          }
        },
      );
    }
  };

  deleteFile = async (
    index: number,
    sendChange = true,
  ): Promise<void> => {
    const temp = this.state.value.find((_s, id) => id === index);
    const { onDelete } = this.props;
    let callBack: () => void;
    if (sendChange && temp && onDelete) {
      const { value } = temp;
      const call = onDelete([value]);
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
    this.setState(
      ({ value }) => {
        return {
          value: Array.isArray(value)
            ? value.filter((_, id) => id !== index)
            : [],
          valueTemp: [],
        };
      },
      () => {
        const { changeField, name, type } = this.props;
        changeField &&
          changeField(
            {
              target: {
                name,
                value: Array.isArray(this.state.value)
                  ? this.state.value.map(({ value }) => {
                      if (value instanceof File) {
                        return value;
                      } else {
                        if (value.file instanceof File) {
                          return value.file;
                        } else {
                          return value;
                        }
                      }
                    })
                  : null,
                type,
              },
            },
            callBack,
          );
      },
    );
  };

  convertToRegex(param: string) {
    return new RegExp(`${param}(?=(?:[^"]*"[^"]*")*(?![^"]*"))`);
  }

  clearValueTemp = () => {
    this.setState({ valueTemp: [] });
  };

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

  validateFile: (fileName: string) => boolean = fileName => {
    const {
      validateExtensions,
      validateAccept,
      accept: acceptFiles,
      extensions,
    } = this.extraProps;

    const { lookup } = this.state;
    if (!lookup) return true;

    const accept = this.convertAccept(acceptFiles);

    const hasExtensions = (): boolean => {
      if (this.validExtensions()) {
        return new RegExp(
          `(${extensions.join('|').replace(/\./g, '\\.')})$`,
        ).test(fileName.toLowerCase());
      }
      return true;
    };

    const acceptValidate = () =>
      !!(
        accept.find((a: string): boolean => {
          if (!lookup(fileName)) return false;
          return !!(lookup(fileName) || '').match(
            new RegExp(`${a.replace(/(\.\*|\.|\*)$/, '')}.*`),
          );
        }) ||
        ('*' === acceptFiles || acceptFiles === '')
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
  };

  getExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  isOpen = false;

  public render() {
    const { classes, error, label, name, ns } = this.props;
    const {
      multiple,
      subLabel,
      accept: acceptOriginal,
    } = this.extraProps;

    const accept = this.convertAccept(acceptOriginal);
    const {
      value,
      valueTemp,
      inputValue,
      lookup,
      loading,
    } = this.state;
    const { state, message, ns: nsError, props } = error || {
      state: false,
      message: '',
      ns,
      props: {},
    };
    const files: Value[] = [...(value || []), ...(valueTemp || [])];

    return (
      <>
        <Paper
          elevation={1}
          style={{
            position: 'relative',
            padding: '1em',
            borderBottom:
              state || valueTemp.length
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
              changeField: (...value) => this.changeField(...value),
              openFileDialog: (...value) =>
                this.openFileDialog(...value),
              deleteFile: (...value) => this.deleteFile(...value),
            }}
          />
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
          {(!lookup || loading) &&
            this.canImportMime &&
            React.createElement(() => {
              const [progress, setProgress] = React.useState(0);
              React.useEffect(() => {
                function tick() {
                  // reset when reaching 100%
                  setProgress(oldProgress =>
                    oldProgress >= 100 ? 0 : oldProgress + 1,
                  );
                }

                const timer = setInterval(tick, 20);
                return () => {
                  clearInterval(timer);
                };
              }, []);

              return (
                <div className={classes.progress}>
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                  />
                </div>
              );
            })}
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
      </>
    );
  }
}

export default compose<AllProps, Props>(
  withStyles(styles, { name: 'FileInput' }),
)(FileInput);
