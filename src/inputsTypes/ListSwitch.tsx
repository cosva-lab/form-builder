import React from 'react';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import { observer } from 'mobx-react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { InputPropsSwitchList } from '..';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  });

interface Props
  extends InputPropsSwitchList,
    WithStyles<typeof styles> {}

@observer
class ListSwitchComponent extends React.Component<Props> {
  state = {
    checked: ['wifi'],
  };

  handleToggle = (value: string) => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  public render() {
    const { classes } = this.props;

    return (
      <List
        subheader={<ListSubheader>Settings</ListSubheader>}
        className={classes.root}
      >
        <ListItem>
          <ListItemIcon>
            <WifiIcon />
          </ListItemIcon>
          <ListItemText primary="Editar" />
          <ListItemSecondaryAction>
            <Switch
              onChange={this.handleToggle('wifi')}
              checked={this.state.checked.indexOf('wifi') !== -1}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BluetoothIcon />
          </ListItemIcon>
          <ListItemText primary="Eliminar" />
          <ListItemSecondaryAction>
            <Switch
              onChange={this.handleToggle('bluetooth')}
              checked={this.state.checked.indexOf('bluetooth') !== -1}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
}

export const ListSwitch = withStyles(styles)(ListSwitchComponent);

export default ListSwitch;