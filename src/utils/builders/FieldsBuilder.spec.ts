import { describe } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import FieldsBuilder from './FieldsBuilder';
import { buildField } from '../buildField';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('FieldsBuilder', () => {
  it('should return fields', () => {
    function lastNameField() {
      return buildField({
        name: 'lastName',
        value: '',
        label: '',
        type: 'text',
      });
    }

    const { fields, get, getValues, onChangeField, getErrors } =
      new FieldsBuilder({
        fields: [
          buildField({
            name: 'name',
            value: '',
          }),
          buildField({
            name: 'age',
            value: 22,
            label: 'Age',
          }),
          lastNameField(),
          buildField({
            name: 'date',
            value: '' as 'add' | 'sub',
            label: '',
            type: 'date',
            validations: [
              ({ field }) => {
                return {
                  date: {
                    message: 'This field can not be empty',
                  },
                };
                //
              },
            ],
          }),
        ],
      });

    getErrors().then((errors) => {
      errors.date;
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

    const lastNameErrors = get('lastName').errors;

    const lastName = get('lastName').value;
    expect(lastName).to.be.equal('Maria');

    const fieldAge = fields[1];
    if (fieldAge.name === 'age') {
      expect(fieldAge.value).to.be.equal(20);
    }
    expect(getValues().age).to.be.equal(20);
  });

  it('should build fields from a function', () => {
    const getBasicFields = () => [
      buildField({
        name: 'name',
        value: '',
      }),
      buildField({
        name: 'age',
        value: 22,
        label: 'Age',
      }),
    ];
    const { fields } = new FieldsBuilder({
      fields: [...getBasicFields()],
    });
  });
});
