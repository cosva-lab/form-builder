import React from 'react';
import { Theme, adaptV4Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {
  FieldsRender,
  FieldsBuilder,
  FieldTranslateProvider,
} from './@cosva-lab/form-builder';
import { Grid, Button, ButtonGroup } from '@mui/material';
import { darken, ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';

import { teal, grey, blue } from '@mui/material/colors';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const theme = createTheme(adaptV4Theme({
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
}));

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
    fields: [
      {
        name: 'name',
        label: 'Name',
        value: '',
        validate: false,
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
        onChange: ({ field, target }) => {
          let cb = () => {};
          if (target instanceof HTMLInputElement) {
            const start = target.selectionStart;
            const end = target.selectionEnd;
            cb = () =>
              start && end && target.setSelectionRange(start, end);
          }
          field && field.setValue(target.value.trim().toLowerCase());
          return () => cb && cb();
        },
      },
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
    getErrors,
  } = fieldsBuilder;
  const classes = useStyles();
  console.log(fields);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <FieldTranslateProvider translator={({ message }) => message}>
          <div className={classes.container}>
            <Grid container>
              <ButtonGroup
                fullWidth
                aria-label="full width outlined button group"
              >
                <Button
                  onClick={async () => {
                    restore();
                  }}>
                  Reset
                </Button>
                <Button
                  onClick={async () => {
                    restoreLast();
                  }}>
                  Restore
                </Button>
                <Button
                  onClick={async () => {
                    saveData();
                  }}>
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
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={async () => {
                  if (
                    await fieldsBuilder.hasErrors({
                      setErrors: true,
                    })
                  )
                    console.log(await getErrors());
                }}
              >
                Validate
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={async () => {
                  if (!(await fieldsBuilder.hasErrors())) {
                    console.log(fieldsBuilder.getValues());
                  }
                }}
              >
                Get Values
              </Button>
            </Grid>
          </div>
        </FieldTranslateProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
