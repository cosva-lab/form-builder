import { FieldsRenderProps } from './../index.d';
import InputsValidator from './validate/InputsValidator';
import transformFields from './transformFields';

export default class FormBuilder extends InputsValidator
  implements FieldsRenderProps {
  id?: number;
  ns?: string;
  isNew?: boolean;
  validationState?: boolean;
  validate?: boolean;
  constructor({
    id,
    ns,
    isNew,
    validationState,
    validate,
    fields,
  }: FieldsRenderProps) {
    super(fields);
    this.id = id;
    this.ns = ns;
    this.isNew = isNew;
    this.validationState = validationState;
    this.validate = validate;
    this.fields = fields;
  }

  getFieldsObject = () => {
    const fields: { [key: string]: any } = {};
    transformFields(this.fields).forEach(({ name, value }) => {
      fields[name] = value;
    });
    return fields;
  };
}
