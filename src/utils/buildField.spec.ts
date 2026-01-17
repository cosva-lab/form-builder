import { buildField } from './buildField';

buildField({
  name: 'breed',
  value: undefined as 'a' | 'b' | null | undefined,
  type: 'component',
  component: ({ field }) => null,
  validations: [
    ({ value }) =>
      value ? undefined : { rule: 'isEmpty', message: 'required' },
  ],
});
