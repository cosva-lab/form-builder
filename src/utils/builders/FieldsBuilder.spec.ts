import { describe } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PropsField } from '../../types';
import FieldsBuilder from './FieldsBuilder';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FieldsBuilder', () => {
  it('should return fields', () => {
    function lastNameField(): PropsField<string, 'lastName'> {
      return {
        name: 'lastName',
        value: '',
      };
    }

    const {
      fields,
      get,
      getField,
      getValues,
      onChangeField,
      fieldsMap,
    } = new FieldsBuilder({
      fields: [
        {
          name: 'name',
          value: '',
        },
        {
          name: 'age',
          value: 22,
        },
        lastNameField(),
      ],
    });

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
