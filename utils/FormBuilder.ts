import produce from 'immer';
import {
  FieldsRenderBasic,
  FieldsRenderProps,
  EventField,
} from './../index.d';
import InputsValidator from './validate/InputsValidator';
import transformFields from './transformFields';
import { Component, State } from '.';
import { changeValueFields } from './changeValues';

export default class FormBuilder extends InputsValidator
  implements FieldsRenderBasic {
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
    super(transformFields(fields));
    this.id = id;
    this.ns = ns;
    this.isNew = isNew;
    this.validationState = validationState;
    this.validate = validate;
  }

  getFieldsObject = () => {
    const fields: { [key: string]: any } = {};
    transformFields(this.fields).forEach(({ name, value }) => {
      fields[name] = value;
    });
    return fields;
  };

  handleChange = (component: Component, callback?: () => void) => ({
    target,
  }: EventField) => {
    const { value, name } = target;
    component.setState(
      state =>
        produce<State, State>(state, (draft): void => {
          const fields = draft.fieldsRender.fields;
          draft.fieldsRender.fields = changeValueFields({
            fields: fields,
            action: { name, value },
          });
        }),
      callback,
    );
  };

  setValidation = (component: Component, callback?: () => void) => (
    validate: boolean,
  ) => {
    component.setState(
      state =>
        produce<State, State>(state, (draft): void => {
          draft.fieldsRender.validate = validate;
        }),
      callback,
    );
  };
}
