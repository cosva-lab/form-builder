import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import BoxStacker from './BoxStacker';
import EnhancedTable from '../../Table/EnhancedTable';

import MessagesTranslate from '../../MessagesTranslate';

const styles = theme => ({});

class BoxForm extends React.PureComponent {
  handleAddBox = fields => {
    const { value, onChange, changeFields, name } = this.props;
    onChange(changeFields({ value, fields, name }));
  };

  handleRemoveBox = selected => {
    const { value, name, onChange } = this.props;
    let data = value;
    selected.forEach(element => {
      data = data.filter(obj => obj.id !== element);
    });
    onChange({ target: { value: data, name } });
  };

  render() {
    const { rows, value, fields, ...propsRest } = this.props;
    const { ns, title, buttonTitle, tableTitle } = propsRest;
    const { handleRemoveBox, handleAddBox } = this;
    return (
      <FormControl fullWidth>
        <React.Fragment>
          <Typography variant="h5" gutterBottom>
            <MessagesTranslate ns={ns} type={title} />
          </Typography>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={16}
          >
            <Grid item xs={12} sm={12}>
              <BoxStacker
                {...{
                  fields,
                  handleAddBox,
                  buttonTitle,
                  ns,
                  ...propsRest,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <EnhancedTable
                title={
                  <MessagesTranslate ns={ns} type={tableTitle} />
                }
                rows={rows}
                data={value}
                paginator={true}
                numEmptyRows={0}
                onRemove={(e, selected) => {
                  handleRemoveBox(selected);
                }}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      </FormControl>
    );
  }
}

BoxForm.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  changeFields: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  tableTitle: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
};
BoxForm.defaultProps = {
  changeFields: fields => {},
};

export default compose(withStyles(styles, { name: 'BoxForm' }))(
  BoxForm,
);
