import * as React from 'react';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Loading from '../../Loading';
import { getMessage } from '../../MessagesTranslate';
import { EventField, ExtraProps, Message } from '../..';

interface PropsDropdownList {
  fullWidth?: boolean;
  disabled?: boolean;
  error?: Message;
  value: string;
  ns: string;
  onChange(e: EventField): void;
  sendChange(): void;
  label?: any;
  name: string;
  extraProps?: ExtraProps;
}
interface StateDropdownList {
  shrink: boolean;
  listOpen: boolean;
  serverSide: boolean;
  value: unknown;
  menuItems: any;
}
class DropdownList extends React.PureComponent<
  PropsDropdownList,
  StateDropdownList
> {
  static defaultProps: Partial<PropsDropdownList> = {
    disabled: false,
    extraProps: {
      timeConsult: 20 * 1000,
      helpMessage: true,
      search: {
        state: false,
        value: -1,
      },
    },
    onChange: () => {
      // do something
    },
  };

  public getSelect = false;

  state = {
    shrink: false,
    listOpen: false,
    serverSide: false,
    value: '',
    menuItems: [],
  };

  componentDidMount() {
    const { value } = this.props;
    if (value !== '') {
      this.setState({ value });
    }
  }

  UNSAFE_componentWillMount() {
    const { props } = this;
    if (!props.disabled) {
      this.getData();
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: PropsDropdownList) {
    const { props, state } = this;
    const { extraProps, disabled } = newProps;
    const {
      extraProps: extraPropsOld,
      disabled: disabledOld,
    } = props;

    if (extraProps && extraPropsOld) {
      const { search } = extraProps;
      const { search: searchOld } = extraPropsOld;
      if (search && searchOld && search.state !== searchOld.state) {
        this.getData(newProps);
      }
    }
    if (disabled !== disabledOld) {
      this.getData(newProps);
    }
    if (newProps.value !== state.value) {
      this.setState({ value: newProps.value });
    }
  }

  changeField = (event: any): void => {
    const { target } = event;
    const { name, value, type } = target;
    this.setState({
      shrink: true,
      value,
    });
    this.props.onChange({
      target: { name, value, type },
    });
  };

  getData = (newProps: PropsDropdownList | undefined = undefined) => {
    const { props } = this;
    const { disabled, extraProps } = newProps || props;
    const { searchId, search } = extraProps || {
      searchId: undefined,
      search: undefined,
    };
    if (
      !disabled &&
      (!searchId || (searchId && search && search.state))
    ) {
      /**
       * @param string
       * @type {method spring}
       */
    }
  };

  public render() {
    const { value, menuItems, listOpen, serverSide } = this.state;
    const {
      label,
      name,
      error,
      disabled,
      extraProps,
      fullWidth,
    } = this.props;

    const {
      searchId,
      search,
      timeConsult,
      helpMessage,
    } = extraProps || {
      searchId: undefined,
      search: { state: false, value: -1 },
      timeConsult: undefined,
      helpMessage: undefined,
    };

    let stateList = disabled;
    if (searchId && search) {
      stateList = !search.state;
    }
    return (
      <FormControl fullWidth={fullWidth} error={error && error.state}>
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={stateList}
          value={value === '' ? (helpMessage ? -1 : value) : value}
          input={<Input name={name} />}
          onChange={this.changeField}
          open={listOpen}
          onOpen={() => {
            if (this.getSelect) {
              setTimeout(() => {
                this.getSelect = true;
              }, timeConsult);
              this.getData();
              this.getSelect = false;
            } else {
              this.getSelect = true;
            }
            this.setState({ listOpen: true });
          }}
          onClose={() => {
            this.setState({ listOpen: false });
          }}
        >
          {serverSide && (
            <MenuItem
              value={-1}
              key={-2}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {listOpen && <Loading />}
              {getMessage({
                ns: 'general',
                message: 'charging',
              })}
            </MenuItem>
          )}
          {!serverSide &&
            (helpMessage ? (
              <MenuItem disabled={listOpen} value={-1} key={-1}>
                Selecciona una de las opciones
              </MenuItem>
            ) : null)}
          {!serverSide && menuItems}
        </Select>
        {error && error.message && (
          <FormHelperText>{error.message}</FormHelperText>
        )}
      </FormControl>
    );
  }
}

export { DropdownList };
export default DropdownList;
