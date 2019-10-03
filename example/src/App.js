import React from 'react';

import { FieldsRender, FieldsBuilder } from '@cosva-lab/form-builder';
import { Grid, Button } from '@material-ui/core';

const {
  fields,
  changeField,
  validate,
  validationState,
} = new FieldsBuilder({
  validate: true,
  validationState: true,
  fields: [
    {
      name: 'name',
      label: 'Name',
      value: '',
      sm: 4,
      validChange: true,
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    {
      name: 'age',
      label: 'Age',
      value: '',
      sm: 4,
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    {
      name: 'fgdfgfdgdg',
      value: '',
      sm: 4,
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    {
      name: 'fgds',
      value: '',
      sm: 4,
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
  ],
});
export default function App() {
  return (
    <Grid container spacing={4}>
      <FieldsRender
        {...{
          fields,
          changeField: changeField(),
          validate,
          validationState,
          validate,
        }}
      />
      <Grid>
        <Button color="default" onClick={async () => {}}>
          dfsdfds
        </Button>
      </Grid>
    </Grid>
  );
}
