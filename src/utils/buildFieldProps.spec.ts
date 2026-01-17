import { buildFieldProps } from './buildFieldProps';

describe('buildFieldProps', () => {
  it('should infer value type in validations', () => {
    const props = buildFieldProps({
      name: 'test',
      value: 123 as number | string,
      validations: [
        ({ value }) => {
          const x: number | string = value;
          return undefined;
        },
      ],
    });
  });
});
