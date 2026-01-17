import { buildField } from './buildField';

buildField({
  name: 'breed',
  value: undefined as 'a' | 'b' | null | undefined,
  type: 'component',
  component: ({ field }) => null,
  validations: [
    ({ value }) => {
      const x: 'a' | 'b' | null | undefined = value;
      return value ? undefined : { rule: 'isEmpty', message: 'required' };
    },
  ],
});
