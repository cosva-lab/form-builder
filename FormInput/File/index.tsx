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
import { Props, States, Lookup, handleChangeFiles } from './Props';
import ListFiles from './ListFiles';
import { styles } from './styles';

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

export const mimeTypes = import('mime-types');

class FileInput extends React.Component<Props, States> {
  public inputOpenFileRef: React.RefObject<any> = React.createRef();

  get lookup(): Lookup {
    const { lookup } = this.state;
    if (!lookup) return () => false;
    return lookup;
  }

  constructor(props: Props) {
    super(props);
    const { extraProps } = this.props;
    const { multiple } = extraProps || defaultPropsExtra;
    this.state = {
      value: multiple ? [] : null,
      lookup: false,
      inputValue: '',
    };
  }

  static defaultProps = {
    extraProps: defaultPropsExtra,
  };

  animation = true;

  blurBool = true;

  componentDidMount() {
    this.validExtensions();
    mimeTypes.then(({ lookup }) => {
      this.setState({ lookup });
    });
  }

  validExtensions(): boolean {
    const extensions = this.props!.extraProps!.extensions;
    let error: boolean = false;
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

  componentDidUpdate(newProps: Props) {
    const state = this.props.error!.state;
    const stateProps = newProps.error!.state;
    if (stateProps !== state) {
      this.animation = true;
    }
  }

  openFileDialog = () => {
    this.inputOpenFileRef.current!.click();
  };

  handleChange: handleChangeFiles = target => {
    const { extraProps } = this.props;
    const { multiple } = extraProps || defaultPropsExtra;
    if (!target.files![0]) return;
    this.setState(
      ({ value }) => {
        const { name } = target.files![0];
        let newValue;
        if (multiple) {
          newValue = [
            ...(Array.isArray(value) ? value : []),
            ...Array.from(target.files || []).map(file => ({
              file,
              fileName: name,
              id: uuid.v4(),
            })),
          ];
        } else {
          newValue = {
            fileName: name,
            file: target.files![0],
            id: uuid.v4(),
          };
        }
        return {
          value: newValue,
        };
      },
      () => {
        const { handleChange, name, type } = this.props;
        let value: File[] | File | false = false;
        if (multiple && Array.isArray(this.state.value)) {
          value = this.state.value.map(({ file }) => file);
          this.state.value.forEach(({ file, id }) => {
            if (!this.validateFile(file.name)) {
              this.deleteFile(id);
            }
          });
        } else {
          if (
            typeof this.state.value === 'object' &&
            !Array.isArray(this.state.value)
          ) {
            value = this.state.value!.file;
          }
        }
        if (value) {
          handleChange({
            target: {
              name,
              value,
              type,
            },
            waitTime: false,
          });
        }
        this.setState({ inputValue: '' });
      },
    );
  };

  deleteFile = (index: string): void => {
    const { extraProps } = this.props;
    const { multiple } = extraProps || defaultPropsExtra;
    this.setState(
      ({ value }) => {
        return {
          value:
            multiple && Array.isArray(value)
              ? value.filter(({ id }) => id !== index)
              : null,
        };
      },
      () => {
        const {
          handleChange,
          name,
          type,
          validateField,
        } = this.props;
        handleChange({
          target: {
            name,
            value:
              multiple && Array.isArray(this.state.value)
                ? this.state.value.map(({ file }) => file)
                : null,
            type,
          },
          waitTime: false,
        });
        validateField();
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

  validateFile: (fileName: string) => boolean = fileName => {
    const {
      validateExtensions = true,
      validateAccept = true,
      accept: acceptFiles = '*',
      extensions = ['.*'],
    } = this.props!.extraProps || defaultPropsExtra;

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
      !!accept.find((a: string): boolean => {
        if (!this.lookup(fileName)) return false;
        return !!(this.lookup(fileName) || '').match(
          new RegExp(`${a.replace(/(\.\*|\.|\*)$/, '')}.*`),
        );
      });

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

  render() {
    const { classes, error, label, name, ns } = this.props;
    let extraProps = {
      ...defaultPropsExtra,
      ...this.props.extraProps,
    };
    const { multiple, subLabel } = extraProps || defaultPropsExtra;

    const accept = this.convertAccept(extraProps.accept);
    const { value, lookup, inputValue } = this.state;

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
          style={{
            position: 'relative',
            padding: '1em',
            borderBottom: state ? '2px solid #f44336' : undefined,
          }}
        >
          <ListFiles
            {...{
              label,
              ns,
              name,
              value,
              multiple,
              subLabel: subLabel || defaultPropsExtra.subLabel,
              classes,
              handleChange: this.handleChange,
              lookup: this.lookup,
              openFileDialog: this.openFileDialog,
              validateFile: this.validateFile,
              deleteFile: this.deleteFile,
            }}
          />
          <Grid container onClick={this.openFileDialog}>
            <input
              ref={this.inputOpenFileRef}
              onChange={({ target }) => {
                this.handleChange(target);
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
      </React.Fragment>
    );
  }
}

export default compose<Props, {}>(
  withStyles(styles, { name: 'FileInput' }),
)(FileInput);
