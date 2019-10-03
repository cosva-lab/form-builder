import React from 'react';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import InputBase from '@material-ui/core/InputBase';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { InputPropsChips } from '../types';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      padding: theme.spacing(1 / 2),
      borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    },
    chip: {
      margin: theme.spacing(1 / 2),
      width: '100%',
      flex: 0,
    },
    input: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    formControl: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      flex: '1 1 10%',
    },
    labelChip: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'block',
    },
  });

interface Props extends InputPropsChips, WithStyles<typeof styles> {}

export const Chips = withStyles(styles)(
  class Chips extends React.Component<
    { value: ChipProps[] } & Props & ChipProps
  > {
    state = { input: '' };

    public deleteFlag = false;

    public handleDelete = (index: number) => () => {
      const { value, name, extraProps } = this.props;
      let onDelete = ({ value, index }: any) => {
        value.splice(index, 1);
        return value;
      };
      onDelete =
        (extraProps &&
          extraProps.actions &&
          extraProps.actions.onDelete) ||
        onDelete;
      this.props.changeField({
        target: { name, value: onDelete({ value, index }) },
      });
    };

    public render() {
      const {
        classes,
        color: colorGeneral,
        icon: iconGeneral,
        avatar: avatarGeneral,
        variant: variantGeneral,
        value,
        name,
        changeField,
      } = this.props;
      const { input } = this.state;
      return (
        <React.Fragment>
          <div className={classes.root}>
            {value.map((data: ChipProps, key: number) => {
              const {
                color = colorGeneral,
                icon = iconGeneral,
                avatar = avatarGeneral,
                variant = variantGeneral,
              } = data;
              return (
                <Chip
                  classes={{
                    label: classes.labelChip,
                  }}
                  key={key}
                  {...{
                    color,
                    icon,
                    avatar,
                    variant,
                  }}
                  label={data.label}
                  onDelete={this.handleDelete(key)}
                  className={classes.chip}
                />
              );
            })}
            <InputBase
              onChange={({ target: { value: valueTarget } }) => {
                this.setState({ input: valueTarget });
              }}
              onKeyUp={e => {
                if (input.length > 0) {
                  this.deleteFlag = false;
                }
                if (e.key === 'Enter') {
                  const addDefault = (v: string) => ({ label: v });
                  const { extraProps } = this.props;
                  const onAdd =
                    (extraProps &&
                      extraProps.actions &&
                      extraProps.actions.onAdd) ||
                    addDefault;
                  let valueParsed = [...value, onAdd(input)];
                  if (!onAdd(input)) {
                    console.error(
                      `The function onAdd don't return a value.`,
                    );
                    valueParsed = [...value, addDefault(input)];
                  }
                  changeField({
                    target: {
                      name,
                      value: valueParsed,
                    },
                  });
                  this.setState({ input: '' });
                }
                if (e.key === 'Backspace') {
                  if (input.length === 0) {
                    if (!this.deleteFlag) {
                      this.deleteFlag = true;
                    } else {
                      this.handleDelete(value.length - 1)();
                    }
                  }
                }
              }}
              className={classes.formControl}
              value={input}
            />
          </div>
        </React.Fragment>
      );
    }
  },
);

export default Chips;
