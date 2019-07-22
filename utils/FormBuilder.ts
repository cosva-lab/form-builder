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
  component?: Component;
  setState = true;

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

  changeField = (callback?: () => void) => ({
    target,
  }: EventField) => {
    const { value, name } = target;
    if (this.component && this.setState) {
      this.component.setState(
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
    } else {
      this.fields = changeValueFields({
        fields: this.fields,
        action: { name, value },
      });
    }
  };

  changeFields = (callback?: () => void) => (
    fields: EventField[],
  ) => {
    const setState = this.setState;
    this.setState = false;
    fields.forEach(field => {
      this.changeField()(field);
    });
    this.setState = setState;

    if (this.component) {
      this.component.setState(
        state =>
          produce<State, State>(state, (draft): void => {
            draft.fieldsRender.fields = this.fields;
          }),
        callback,
      );
    }
  };

  setValidation = (validate: boolean, callback?: () => void) => {
    if (this.component) {
      this.component.setState(
        state =>
          produce<State, State>(state, (draft): void => {
            draft.fieldsRender.validate = validate;
          }),
        callback,
      );
    } else {
      this.validate = validate;
    }
  };

  setComponent = (component: Component) => {
    this.component = component;
  };
}
