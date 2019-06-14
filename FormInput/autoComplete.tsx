import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import NoSsr from '@material-ui/core/NoSsr';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { InputPropsComplete, extraProps } from '..';

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    input: {
      display: 'flex',
      padding: 0,
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: spacing(1 / 2, 1 / 4),
    },
    chipFocused: {
      backgroundColor: emphasize(
        palette.type === 'light'
          ? palette.grey[300]
          : palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: spacing(2),
    },
  });

function inputComponent({ inputRef, ...props }: any) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: any) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props: any) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props: any) {
  return (
    <Typography
      component="div"
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props: any) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: any) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props: any) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props: any) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

interface Props
  extends InputPropsComplete,
    WithStyles<typeof styles, true> {}

class AutoComplete extends React.Component<Props> {
  static defaultProps = {
    value: {},
  };
  state = {};

  handleChange = (name: string) => (value: any) => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    const {
      classes,
      theme,
      extraProps,
      name,
      label,
      value: optionValue,
      defaultInputValue,
      handleChange,
    } = this.props;
    const {
      multiple,
      options,
      filterOption = undefined,
      onKeyDown,
      NoOptionsMessage = (props: any) => (
        <Typography
          color="textSecondary"
          className={props.selectProps.classes.noOptionsMessage}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
      ),
    } = extraProps as extraProps;
    const { value } = optionValue || { value: '' };
    const selectStyles = {
      witdh: 100,
      input: (base: any) => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
      menuPortal: (base: any) => ({
        ...base,
        zIndex: theme.zIndex.modal + 1,
      }),
    };
    if (multiple) {
      return (
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            menuPortalTarget={document.body}
            textFieldProps={{
              label: 'Label',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={options}
            components={{ ...(components as any), NoOptionsMessage }}
            value={value}
            onChange={this.handleChange('multi')}
            placeholder="Select multiple countries"
            isMulti
            defaultInputValue={defaultInputValue}
          />
        </NoSsr>
      );
    }
    return (
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          menuPortalTarget={document.body}
          options={options}
          components={{ ...(components as any), NoOptionsMessage }}
          value={value ? optionValue : null}
          onChange={(option: any) => {
            handleChange({
              target: {
                name,
                value: option,
                type: 'autoComplete',
              },
            });
          }}
          onKeyDown={onKeyDown}
          placeholder={label as string}
          isClearable
          filterOption={filterOption}
        />
      </NoSsr>
    );
  }
}

export default withStyles(styles, {
  name: 'AutoComplete',
  withTheme: true,
})(AutoComplete);
