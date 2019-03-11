// assets/js/Components/ItemCard.js
import React from 'react';
import Select from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const MenuItemSelect = ({ id, name }) => (
<MenuItem  value={id} primaryText={name}
>
</MenuItem>
);

export default MenuItemSelect;