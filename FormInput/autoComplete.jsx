import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import NoSsr from '@material-ui/core/NoSsr';
/* import MenuList from '@material-ui/core/MenuList'; */

const styles = ({ spacing, palette }) => ({
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
    margin: `${spacing.unit / 2}px ${spacing.unit / 4}px`,
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
    padding: `${spacing.unit}px ${spacing.unit * 2}px`,
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
    marginTop: spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: spacing.unit * 2,
  },
});

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
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

function Option(props) {
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

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
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

function Menu(props) {
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

class AutoComplete extends React.Component {
  state = {
    single: null,
    multi: null,
  };

  handleChange = name => value => {
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
      value,
      handleChange,
    } = this.props;
    const {
      multiple,
      options,
      filterOption = undefined,
      onKeyDown,
      inputValue,
      NoOptionsMessage = props => (
        <Typography
          color="textSecondary"
          className={props.selectProps.classes.noOptionsMessage}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
      ),
    } = extraProps;
    const selectStyles = {
      witdh: 100,
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
      menuPortal: base => ({
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
            menuPortalTarget={document.querySelector(
              '.MuiDialogContent-root-302',
            )}
            textFieldProps={{
              label: 'Label',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={options}
            components={{ ...components, NoOptionsMessage }}
            value={value}
            onChange={this.handleChange('multi')}
            placeholder="Select multiple countries"
            isMulti
            defaultInputValue={inputValue}
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
          components={{ ...components, NoOptionsMessage }}
          value={value}
          onChange={option => {
            handleChange({ target: { name, value: option } });
          }}
          onKeyDown={onKeyDown}
          placeholder="Search a country (start with a)"
          isClearable
          filterOption={filterOption}
        />
      </NoSsr>
    );
  }
}

AutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  extraProps: PropTypes.shape({
    multiple: PropTypes.string,
    options: PropTypes.array,
    NoOptionsMessage: PropTypes.func,
  }),
};

AutoComplete.default = {
  extraProps: {
    multiple: false,
    options: [],
  },
};

export default withStyles(styles, { withTheme: true })(AutoComplete);
