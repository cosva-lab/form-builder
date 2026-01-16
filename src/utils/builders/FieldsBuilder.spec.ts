import { describe } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import FieldsBuilder from './FieldsBuilder';
import { PropsField } from '../../types';
import FieldBuilder, { field } from './FieldBuilder';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FieldsBuilder', () => {
  it('should return fields', () => {
    function lastNameField() {
      return new FieldBuilder({
        name: 'lastName',
        value: '',
        label: '',
        type: 'text',
      });
    }
    lastNameField().type;

    const { fields, get, getValues, onChangeField } =
      new FieldsBuilder({
        fields: [
          field({
            name: 'name',
            value: '',
          }),
          field({
            name: 'age',
            value: 22,
            label: 'Age',
          }),
          lastNameField(),
          field({
            name: 'date',
            value: '' as 'add' | 'sub',
            label: '',
            type: 'date',
            validations: [
              ({ field }) => {
                field.name;
                //
              },
            ],
          }),
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
    onChangeField({
      name: 'date',
      value: 'add',
    });

    const lastName = get('lastName').value;
    expect(lastName).to.be.equal('Maria');

    const fieldAge = fields[0];
    if (fieldAge.name === 'name') {
      expect(fieldAge.value).to.be.equal(20);
    }
    expect(getValues().age).to.be.equal(20);
  });
});
