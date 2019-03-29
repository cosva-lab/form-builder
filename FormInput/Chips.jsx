import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import Input from '../Input';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class ChipsArray extends React.Component {
  state = { input: '' };

  handleChange = props => {
    console.log(props);
  };

  handleDelete = data => () => {
    const { value, name } = this.props;
    const chipData = [...value];
    const chipToDelete = chipData.indexOf(data);
    chipData.splice(chipToDelete, 1);
    this.props.handleChange({ target: { name, value: chipData } });
  };

  render() {
    const {
      classes,
      color: colorGeneral,
      icon: iconGeneral,
      avatar: avatarGeneral,
      variant: variantGeneral,
      value,
    } = this.props;

    const { input } = this.state;
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          {value.map(data => {
            const {
              color = colorGeneral,
              icon = iconGeneral,
              avatar = avatarGeneral,
              variant = variantGeneral,
            } = data;
            return (
              <Chip
                key={data.key}
                {...{
                  color,
                  icon,
                  avatar,
                  variant,
                }}
                label={data.label}
                onDelete={this.handleDelete(data)}
                className={classes.chip}
              />
            );
          })}
        </Paper>
        <Input
          className={classes.input}
          {...{
            label: 'sdffdfdsfs',
            name: 'sdffdfdsfs',
            value: input,
            handleChange: this.handleChange,
            /* error, */
          }}
        />
      </React.Fragment>
    );
  }
}

ChipsArray.propTypes = {
  classes: PropTypes.object.isRequired,
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
  icon: PropTypes.node,
  avatar: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'outlined']),
};

export default withStyles(styles)(ChipsArray);
