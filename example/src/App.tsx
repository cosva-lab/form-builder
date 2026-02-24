import React from 'react';
import {
  FieldsRender,
  FieldsBuilder,
  GlobalTranslateProvider,
  buildField,
} from '@cosva-lab/form-builder';
import { Grid, Button, ButtonGroup, Box } from '@mui/material';
import {
  darken,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles';
import { teal, grey, blue } from '@mui/material/colors';

const theme = createTheme({
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

function initForm() {
  return new FieldsBuilder({
    fields: [
      buildField({
        name: 'name',
        label: 'Name',
        value: '',
        validate: false,
        validations: [
          (value) =>
            !value && {
              rule: 'isEmpty',
              message: 'This field can not be empty',
            },
        ],
      }),
      buildField({
        name: 'age',
        label: 'Age',
        value: '',
        validations: [
          (value) =>
            !value && {
              message: 'This field can not be empty',
            },
        ],
      }),
      buildField({
        name: 'birth_date',
        label: 'Birth date',
        type: 'date',
        value: '',
        validations: [
          (value) =>
            !value && {
              message: 'This field can not be empty',
            },
        ],
      }),
      buildField({
        name: 'email',
        label: 'Email',
        value: '',
        validations: [
          (value) =>
            !value && {
              message: 'This field can not be empty',
            },
        ],
        onChange: ({ field }) => {
          let cb = () => {};
          const target = field.inputRef;
          if (target instanceof HTMLInputElement) {
            const start = target.selectionStart;
            const end = target.selectionEnd;
            cb = () =>
              start && end && target.setSelectionRange(start, end);
            field.setValue(target.value.trim().toLowerCase());
          }
          return () => cb && cb();
        },
      }),
    ],
  });
}

export default function App() {
  const [fieldsBuilder] = React.useState(initForm());
  const {
    fields,
    changeValue,
    validate,
    restoreLast,
    saveData,
    restore,
    getErrors,
  } = fieldsBuilder;

  return (
    <ThemeProvider theme={theme}>
      <GlobalTranslateProvider translator={({ message }) => message}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: 3,
          }}
        >
          <Grid container>
            <ButtonGroup
              fullWidth
              aria-label="full width outlined button group"
            >
              <Button
                onClick={async () => {
                  restore();
                }}
              >
                Reset
              </Button>
              <Button
                onClick={async () => {
                  restoreLast();
                }}
              >
                Restore
              </Button>
              <Button
                onClick={async () => {
                  saveData();
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
                onChangeField: changeValue,
                validate,
              }}
            />
          </Grid>
          <Grid
            container
            sx={{
              padding: 3,
              '& button': { margin: 1 },
            }}
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
        </Box>
      </GlobalTranslateProvider>
    </ThemeProvider>
  );
}
