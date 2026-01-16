import { describe } from 'mocha';
import chai from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import chaiAsPromised from 'chai-as-promised';

import { useFields } from './useFields';
import { PropsField } from '../types';
import { FieldsBuilder } from '../utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('useFields', () => {
  it('should return fields', () => {
    function lastNameField(): PropsField<{
      name: 'lastName';
      value: string;
    }> {
      return {
        name: 'lastName',
        value: '',
      };
    }

    const {
      result: {
        current: { fields, get, getValues, onChangeField },
      },
    } = renderHook(() =>
      useFields(
        new FieldsBuilder({
          fields: [
            {
              name: 'name' as const,
              value: '',
            },
            {
              name: 'age' as const,
              value: 220,
            },
            // lastNameField(),
          ],
        }),
      ),
    );

    onChangeField({
      name: 'age',
      value: 20,
    });
    onChangeField({
      name: 'lastName',
      value: 'Maria',
    });

    const lastName = get('lastName').value;
    expect(lastName).to.be.equal('Maria');

    const fieldAge = fields[0];
    if (fieldAge.name === 'age') {
      expect(fieldAge.value).to.be.equal(20);
    }
    expect(getValues().age).to.be.equal(20);
  });
});
