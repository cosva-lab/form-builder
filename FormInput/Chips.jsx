import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import InputBase from '@material-ui/core/InputBase';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
  },
  chip: {
    margin: theme.spacing.unit / 2,
    width: '100%',
    flex: 0,
  },
  input: {
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
  },
  formControl: {
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
    flex: '1 1 10%',
  },
  labelChip: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
});

class Chips extends React.Component {
  state = { input: '' };

  deleteFlag = false;

  handleChange = props => {
    console.log(props);
  };

  handleDelete = index => () => {
    const {
      value,
      name,
      actions: {
        onDelete = ({ value, index }) => {
          value.splice(index, 1);
          return value;
        },
      },
    } = this.props;
    this.props.handleChange({
      target: { name, value: onDelete({ value, index }) },
    });
  };

  render() {
    const {
      classes,
      color: colorGeneral,
      icon: iconGeneral,
      avatar: avatarGeneral,
      variant: variantGeneral,
      value,
      name,
      handleChange,
    } = this.props;
    const { input } = this.state;
    return (
      <React.Fragment>
        <div className={classes.root}>
          {value.map((data, key) => {
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
                const addDefault = v => ({ label: v });
                const {
                  actions: { onAdd = addDefault },
                } = this.props;
                let valueParsed = [...value, onAdd(input)];
                if (!onAdd(input)) {
                  console.error(
                    `The function onAdd don't return a value.`,
                  );
                  valueParsed = [...value, addDefault(input)];
                }
                handleChange({
                  target: {
                    name,
                    value: valueParsed,
                  },
                  waitTime: false,
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
}

Chips.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    onDelete: PropTypes.func,
    onAdd: PropTypes.func,
  }),
  icon: PropTypes.node,
  avatar: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'outlined']),
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'default',
  ]),
  handleChange: PropTypes.func,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  autoComplete: PropTypes.string,
  value: PropTypes.array,
  error: PropTypes.object,
  InputProps: PropTypes.object,
  waitTime: PropTypes.bool,
};

export default withStyles(styles)(Chips);
