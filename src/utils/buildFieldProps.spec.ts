import { expect } from 'chai';
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
    expect(props.name).to.eq('test');
    expect(props.value).to.eq(123);
  });
  it('should infer the value type in value type', () => {
    const props = buildFieldProps({
      name: 'test',
      value: 123 as number | string,
    });
    expect(props.value).to.eq(123);
  });
});
