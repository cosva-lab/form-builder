import React from 'react';
import compose from 'recompose/compose';
import clsx from 'clsx';
import Select from 'react-select';
import {
  createStyles,
  emphasize,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import { ValueContainerProps } from 'react-select/src/components/containers';
import { ControlProps } from 'react-select/src/components/Control';
import {
  MenuProps,
  NoticeProps,
} from 'react-select/src/components/Menu';
import { MultiValueProps } from 'react-select/src/components/MultiValue';
import { OptionProps } from 'react-select/src/components/Option';
import { PlaceholderProps } from 'react-select/src/components/Placeholder';
import { SingleValueProps } from 'react-select/src/components/SingleValue';
import { InputPropsComplete } from '..';
import { WithStyles } from '@material-ui/styles';
import { WithTranslation, useTranslation } from 'react-i18next';

interface OptionType {
  label: string;
  value: string;
}

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'initial',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  });

function NoOptionsMessage(props: NoticeProps<OptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
} as any;

type InputComponentProps = any;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired,
} as any;

function Option(props: OptionProps<OptionType>) {
  return (
    <MenuItem
      ref={props.innerRef}
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

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
} as any;

function Placeholder(props: PlaceholderProps<OptionType>) {
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

Placeholder.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
} as any;

function SingleValue(props: SingleValueProps<OptionType>) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
} as any;

function ValueContainer(props: ValueContainerProps<OptionType>) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
} as any;

function MultiValue(props: MultiValueProps<OptionType>) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

MultiValue.propTypes = {
  children: PropTypes.node,
  isFocused: PropTypes.bool,
  removeProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
} as any;

function Menu(props: MenuProps<OptionType>) {
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

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object,
} as any;

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

interface AllProps
  extends InputPropsComplete,
    WithTranslation,
    WithStyles<typeof styles, true> {}

class AutoComplete extends React.Component<
  AllProps,
  { value: OptionType | null }
> {
  static defaultProps = {
    value: {},
  };

  public render() {
    const {
      classes,
      theme,
      extraProps,
      name,
      label,
      t,
      defaultInputValue,
      changeField,
      value,
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
      inputValue,
    } = extraProps as any;
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
    let placeholder: string = name;
    if (typeof label === 'string') {
      placeholder = t(label);
    }
    if (typeof label === 'object') {
      placeholder = t(label.message, label.props);
    }
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
            onChange={() => {}}
            placeholder={placeholder}
            isMulti
            defaultInputValue={defaultInputValue}
          />
        </NoSsr>
      );
    }
    return (
      <NoSsr>
        <Select<OptionType>
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          TextFieldProps={{
            label: 'Country',
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
            placeholder: 'Search a country (start with a)',
          }}
          options={options}
          components={{ ...(components as any), NoOptionsMessage }}
          value={value}
          onKeyDown={onKeyDown}
          defaultInputValue={inputValue}
          onChange={(option: any) => {
            changeField({
              target: {
                name,
                value: option,
                type: 'autoComplete',
              },
            });
          }}
          placeholder={placeholder}
          isClearable
          isSearchable
          filterOption={filterOption}
        />
      </NoSsr>
    );
  }
}

export default compose<AllProps, {}>(
  (WrappedComponent: any) => (props: AllProps) => {
    const [t, i18n, ready] = useTranslation(props.ns);
    return (
      <WrappedComponent
        {...{
          ...props,
          t,
          i18n,
          tReady: ready,
        }}
      />
    );
  },
  withStyles(styles, {
    name: 'AutoComplete',
    withTheme: true,
  }),
)(AutoComplete);
