import { useFields } from '../hooks';
import { PropsField } from '../types';
import { FieldsBuilder } from '../utils';

function newFunction(): PropsField<string, 'sdsd'> {
  return {
    name: 'sdsd',
    value: '',
  };
}
const saaaa = newFunction();

const a = new FieldsBuilder({
  fields: [
    {
      name: 'name',
      value: '',
    },
    {
      name: 'age',
      value: 22,
    },
    saaaa,
  ],
});
a.get('sdsd').value;
a.onChangeField({
  name: 'age',
  value: 20,
});
a.getField('name');
a.getValues().age;
a.fieldsMap.age.value;

const field = a.fields[0];

if (field.name === 'age') {
  field.value;
}

const hook = useFields(
  new FieldsBuilder({
    fields: [
      {
        name: 'name',
        value: '',
      },
      {
        name: 'agdde',
        value: 222,
        validations: [
          (a) => {
            const b = a.fieldsBuilder;
            if (b) {
              const c = b.get('fds');
            }
          },
        ],
      },
    ],
  }),
);

const hookField = hook.fieldsMap.agdde.value;
