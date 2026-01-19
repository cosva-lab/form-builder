import { expect } from 'chai';
import { buildFieldProps } from './buildFieldProps';

describe('buildFieldProps', () => {
  describe('should infer value type in validations', () => {
    it('when validations are provided', () => {
      const props = buildFieldProps({
        name: 'test',
        value: 123 as number | string,
        validations: [
          ({ value }) => {
            const x = value satisfies number | string;
            return undefined;
          },
        ],
      });
      expect(props.name).to.eq('test');
      expect(props.value).to.eq(123);
      props.validations satisfies readonly any[];
    });
    it('when validations are not provided', () => {
      const props = buildFieldProps({
        name: 'test',
        value: 123 as number | string,
      });
      expect(props.name).to.eq('test');
      expect(props.value).to.eq(123);
      props.validations satisfies unknown;
    });
  });
  it('should infer the value type in value type', () => {
    const props = buildFieldProps({
      name: 'test',
      value: 123 as number | string,
    });
    expect(props.value).to.eq(123);
  });
});
