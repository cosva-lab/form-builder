import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import {
  FieldsRender,
  FieldsBuilder,
  createField,
  FieldTranslateProvider,
} from './@cosva-lab/form-builder';
import { Grid, Button, ButtonGroup } from '@material-ui/core';
import {
  darken,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';

import { teal, grey, blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: darken(blue.A400, 0.1),
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: theme.spacing(3),
    },
    buttons: {
      padding: theme.spacing(3),
      '& button': { margin: theme.spacing(1) },
    },
  }),
);

function initForm() {
  return new FieldsBuilder({
    validate: false,
    fields: [
      {
        name: 'name',
        label: 'Name',
        value: '',
        breakpoints: {
          sm: 6,
        },
        validChange: true,
        validations: [
          {
            rule: 'isEmpty',
            message: 'This field can not be empty',
          },
        ],
      },
      {
        name: 'age',
        label: 'Age',
        value: '',
        breakpoints: {
          sm: 6,
        },
        validations: [
          {
            rule: 'isEmpty',
            message: 'This field can not be empty',
          },
        ],
      },
      {
        name: 'birth_date',
        label: 'Birth date',
        type: 'date',
        value: '',
        breakpoints: {
          sm: 6,
        },
        validations: [
          {
            rule: 'isEmpty',
            message: 'This field can not be empty',
          },
        ],
      },
      {
        name: 'email',
        label: 'Email',
        value: '',
        breakpoints: {
          sm: 6,
        },
        validations: [
          {
            rule: 'isEmpty',
            message: 'This field can not be empty',
          },
        ],
      },
      createField<File[]>({
        name: 'files',
        type: 'file',
        value: [],
        breakpoints: {
          sm: 12,
        },
        validChange: true,
        validations: [
          {
            rule: 'isEmpty',
            message: 'This field can not be empty',
          },
          ({ value }) => {
            const max = 3;
            return value && value.length > max
              ? {
                  message: `You cannot upload more than ${max} files`,
                  state: true,
                }
              : undefined;
          },
        ],
      }),
    ],
  });
}

export default function App() {
  const [fieldsBuilder] = React.useState(initForm());
  const {
    fields,
    changeField,
    validate,
    restoreLast,
    saveData,
    restore,
  } = fieldsBuilder;
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <FieldTranslateProvider translator={({ message }) => message}>
        <div className={classes.container}>
          <Grid container>
            <ButtonGroup
              fullWidth
              aria-label="full width outlined button group"
            >
              <Button
                color="default"
                onClick={async () => {
                  restore();
                }}
              >
                Reset
              </Button>
              <Button
                color="default"
                onClick={async () => {
                  restoreLast();
                }}
              >
                Restore
              </Button>
              <Button
                color="default"
                onClick={async () => {
                  saveData();
                  restore();
                }}
              >
                Save
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid container spacing={4}>
            <FieldsRender
              {...{
                fields,
                changeField: changeField(),
                validate,
              }}
            />
          </Grid>
          <Grid
            container
            className={classes.buttons}
            justify="flex-end"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                fieldsBuilder.haveErrors({
                  setErrors: true,
                });
              }}
            >
              Validate
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={async () => {
                if (!(await fieldsBuilder.haveErrors())) {
                  console.log(fieldsBuilder.getFieldsObject());
                }
              }}
            >
              Get Values
            </Button>
          </Grid>
        </div>
      </FieldTranslateProvider>
    </ThemeProvider>
  );
}
