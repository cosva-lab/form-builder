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
import { FieldsBuilder, FieldsRender } from '@cosva-lab/form-builder';

const Example = () => {
  /**
   * @description
   * FieldsBuilder uses `mobx`, and you don't need to call a
   * function to set the new value, this makes state changes
   * more efficient.
   */
  const [{ fields, changeField }] = React.useState(
    new FieldsBuilder({
      validate: true,
      fields: [
        {
          name: 'name',
          label: 'Name',
          /**
           * @description `Initial value`
           * @type {any}
           */
          value: '',
          /**
           * `Breakpoints`
           * @param {xs, sm, md, lg, xl}
           * @values `"auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12`
           */
          xs: 3,
          sm: 12,
          md: 6,
          lg: 4,
          xl: 2,
        },
        {
          name: 'phone',
          /**
           * @type {
           * "number" | "time" | "text" | "file" | "email"
           * "date" | "password" | "list" | "table" | "autoComplete"
           * "chips" | "checkbox" | "component" | "listSwitch"
           * }
           */
          type: 'number',
          value: '',
          md: 6,
          validations: [
            {
              rule: 'isEmpty',
              message: 'Este campo es requerido',
            },
            {
              rule: 'isNumeric',
              message: 'Debe ser un numero',
            },
          ],
        },
      ],
    }),
  );
  return (
    <FieldsRender
      fields={fields}
      changeField={changeField(
        // It is a callBack function
        ({ target }) => {
          console.log(target);
        },
      )}
    />
  );
};
```

## License

MIT © [andres112013](https://github.com/andres112013)
