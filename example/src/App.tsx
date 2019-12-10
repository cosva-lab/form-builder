import React from 'react';

import {
  FieldsRender,
  FieldsBuilder,
  createField,
  FieldTranslateProvider,
} from './@cosva-lab/form-builder';
import { Grid, Button } from '@material-ui/core';
import {
  darken,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';

import { teal, grey, blue } from '@material-ui/core/colors';

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
      breakpoints: {
        sm: 4,
      },
      validChange: true,
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    {
      name: 'age',
      label: 'Age',
      value: '',
      breakpoints: {
        sm: 4,
      },
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    {
      name: 'fgdfgfdgdg',
      value: '',
      breakpoints: {
        sm: 4,
      },
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    {
      name: 'fgds',
      value: '',
      breakpoints: {
        sm: 4,
      },
      validations: [{ rule: 'isEmpty', message: 'fdsfkfjsdbndj' }],
    },
    createField<File[]>({
      name: 'files',
      type: 'file',
      value: [],
      breakpoints: {
        sm: 4,
      },
      validChange: true,
      validations: [
        { rule: 'isEmpty', message: 'fdsfkfjsdbndj' },
        ({ value }) =>
          value && value.length > 3
            ? {
                message:
                  'La cantidad de archivos excede el límite máximo',
                state: true,
              }
            : undefined,
      ],
    }),
  ],
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: darken(blue.A400, 0.1),
      /* main: brown[600], */
    },
    background: {
      default: grey[100],
      paper: '#fff',
    },
  },
  typography: {
    fontFamily:
      '"Quicksand","Roboto", "Helvetica", "Arial", sans-serif',
  },
});
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <FieldTranslateProvider translator={({ message }) => message}>
        <Grid container spacing={4}>
          <FieldsRender
            {...{
              fields,
              changeField: changeField(),
              validate,
              validationState,
            }}
          />
          <Grid>
            <Button color="default" onClick={async () => {}}>
              dfsdfds
            </Button>
          </Grid>
        </Grid>
      </FieldTranslateProvider>
    </ThemeProvider>
  );
}
