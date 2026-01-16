import { describe } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { PropsField } from '../../types';
import FieldsBuilder from './FieldsBuilder';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FieldsBuilder', () => {
  it('should return fields', () => {
    function lastNameField(): PropsField<{
      value: string;
      name: 'lastName';
      label: string;
      type: 'text';
    }> {
      return {
        name: 'lastName',
        value: '',
        label: '',
        type: 'text',
      };
    }
    lastNameField().type;

    const { fields, get, getValues, onChangeField } =
      new FieldsBuilder({
        fields: [
          {
            name: 'name',
            value: '',
          },
          {
            name: 'age',
            value: 22,
            label: 'Age',
          },
          lastNameField(),
          {
            name: 'date',
            value: '',
            label: '',
            type: 'date',
            validations: [
              ({ field }) => {
                field.type;
                //
              },
            ],
          },
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
