import { expect } from 'chai';
import { buildField } from './buildField';

describe('buildField', () => {
  it('should infer the value type in validations', () => {
    const field = buildField({
      name: 'breed',
      value: undefined as 'a' | 'b' | null | undefined,
      type: 'component',
      component: () => null,
      validations: [
        ({ value }) => {
          // Type check
          const x: 'a' | 'b' | null | undefined = value;
          return value ? undefined : { rule: 'isEmpty', message: 'required' };
        },
      ],
    });

    expect(field.name).to.eq('breed');
    expect(field.value).to.eq(undefined);
  });
});
