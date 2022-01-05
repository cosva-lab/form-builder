# @cosva-lab/form-builder

> React form builder.

[![NPM](https://img.shields.io/npm/v/@cosva-lab/form-builder.svg)](https://www.npmjs.com/package/@cosva-lab/form-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @cosva-lab/form-builder
```

## Usage

```tsx
import React from 'react';
import {
  FieldsRender,
  FieldsBuilder,
  FieldTranslateProvider,
} from '@cosva-lab/form-builder';
import { Grid, Button, ButtonGroup } from '@material-ui/core';

export default function App() {
  const [fieldsBuilder] = React.useState(
    new FieldsBuilder({
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
              rule: 'isEmail',
              message: "This field don't is email",
            },
          ],
        },
      ],
    }),
  );
  const {
    fields,
    changeField,
    validate,
    restoreLast,
    saveData,
    restore,
  } = fieldsBuilder;

  return (
    <FieldTranslateProvider translator={({ message }) => message}>
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
      <Grid container justify="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            fieldsBuilder.hasErrors({
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
            if (!(await fieldsBuilder.hasErrors())) {
              console.log(fieldsBuilder.getFieldsObject());
            }
          }}
        >
          Get Values
        </Button>
      </Grid>
    </FieldTranslateProvider>
  );
}
```

## License

MIT © [andres112013](https://github.com/andres112013)
