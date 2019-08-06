import React from 'react';
import uuid from 'uuid';
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
import { lookup } from 'mime-types';
import {
  AllProps,
  Props,
  States,
  handleChangeFiles,
  Value,
  FileVa,
} from './Props';
import ListFiles from './Components/ListFiles';
import { styles } from './styles';

const defaultPropsExtra = {
  accept: '*',
  extensions: ['.*'],
  validateExtensions: true,
  validateAccept: true,
  multiple: true,
  subLabel: undefined,
};

class FileInput extends React.Component<AllProps, States> {
  public inputOpenFileRef: React.RefObject<any> = React.createRef();
  public animation = true;

  public blurBool = true;

  static defaultProps = {
    extraProps: defaultPropsExtra,
  };

  constructor(props: AllProps) {
    super(props);
    const { value } = this.props;
    this.state = {
      value: this.setFiles(value),
      valueFiles: value,
      valueTemp: [],
      inputValue: '',
    };
  }

  setFiles(value: FileVa[] = []): Value[] {
    return value.map(file => ({
      file,
      id: uuid.v4(),
      invalid: false,
    }));
  }

  get extraProps() {
    return {
      ...defaultPropsExtra,
      ...this.props.extraProps,
    };
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
  componentWillReceiveProps({ value }: AllProps) {
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

  changeField: handleChangeFiles = target => {
    const { files } = target;
    if (files && files[0]) {
      this.setState(
        ({ value, valueFiles }) => {
          const newValue = Array.isArray(value) ? value : [];
          const newFiles = Array.isArray(valueFiles)
            ? valueFiles
            : [];
          const valueTemp: Value[] = [];
          const tempFiles = Array.from(files || []);
          tempFiles.forEach(file => {
            const id = uuid.v4();
            const va: Value = {
              file: {
                url: URL.createObjectURL(file),
                extension: file.name,
              },
              id,
              invalid: false,
            };
            if (!this.validateFile(file.name)) {
              va.invalid = true;
              valueTemp.push(va);
            } else {
              newFiles.push({ file, id });
              newValue.push(va);
            }
          });

          if (valueTemp.length) {
            setTimeout(() => {
              this.clearValueTemp();
            }, 2000);
          }
          return {
            value: newValue,
            valueFiles: newFiles,
            valueTemp,
            inputValue: '',
          };
        },
        () => {
          const files = this.state.valueFiles;
          if (files) {
            const { changeField, name } = this.props;
            changeField({
              target: {
                name,
                value: Array.isArray(files)
                  ? files.map(({ file }) => file)
                  : null,
              },
            });
          }
        },
      );
    }
  };

  deleteFile = (index: string): void => {
    this.setState(
      ({ value, valueFiles }) => {
        return {
          value: Array.isArray(value)
            ? value.filter(({ id }) => id !== index)
            : [],
          valueFiles: Array.isArray(value)
            ? valueFiles.filter(({ id }) => id !== index)
            : [],
          valueTemp: [],
        };
      },
      () => {
        const { changeField, name, type } = this.props;
        changeField({
          target: {
            name,
            value: Array.isArray(this.state.value)
              ? this.state.valueFiles.map(({ file }) => file)
              : null,
            type,
          },
        });
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
      validateExtensions = true,
      validateAccept = true,
      accept: acceptFiles = '*',
      extensions = ['.*'],
    } = this.extraProps;

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
    const { value, valueTemp, inputValue } = this.state;
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
              changeField: this.changeField,
              openFileDialog: this.openFileDialog,
              deleteFile: this.deleteFile,
            }}
          />
          <Grid container onClick={this.openFileDialog}>
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
          {!lookup &&
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
