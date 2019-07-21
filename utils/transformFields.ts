import { FieldsAll, PropsField } from './../index.d';

export default (fields: FieldsAll): PropsField[] => {
  let fieldsRender: PropsField[];
  if (!Array.isArray(fields)) {
    fieldsRender = Object.entries(fields).map(([name, field]) => ({
      name,
      ...field,
    }));
  } else {
    fieldsRender = fields;
  }
  return fieldsRender;
};
