import produce from 'immer';
import {
  FieldsRenderBasic,
  FieldsRenderProps,
  EventField,
  PropsField,
} from './../index.d';
import InputsValidator from './validate/InputsValidator';
import transformFields from './transformFields';
import { Component, State } from '.';
import { changeValueFields } from './changeValues';
import cloneDeep from 'lodash/cloneDeep';

declare type Callback = () => void;
export default class FormBuilder extends InputsValidator
  implements FieldsRenderBasic {
  id?: number;
  ns?: string;
  isNew?: boolean;
  validationState?: boolean;
  validate?: boolean;
  private component?: Component;
  private originalParams: FormBuilder;
  private parmsLast?: FormBuilder;
  private changeStateComponent: boolean;

  constructor({
    id,
    ns,
    isNew,
    validationState,
    validate,
    fields,
    changeStateComponent = false,
  }: FieldsRenderProps & { changeStateComponent?: boolean }) {
    super(transformFields(fields));
    this.setProps({
      id,
      ns,
      isNew,
      validationState,
      validate,
    });
    this.changeStateComponent = changeStateComponent;
    this.originalParams = cloneDeep(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.restore = this.restore.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.setNew = this.setNew.bind(this);
    this.setFields = this.setFields.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeFields = this.changeFields.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setComponent = this.setComponent.bind(this);
  }

  setProps: (
    props: Pick<
      FormBuilder,
      'id' | 'ns' | 'isNew' | 'validationState' | 'validate'
    >,
  ) => void = ({ id, ns, isNew, validationState, validate }) => {
    this.id = id;
    this.ns = ns;
    this.isNew = isNew;
    this.validationState = validationState;
    this.validate = validate;
  };

  restoreLast() {
    if (this.parmsLast) {
      const { fields, ...rest } = this.parmsLast;
      this.setProps(rest);
      this.fields = fields;
      this.setFields(fields);
      this.parmsLast = undefined;
    }
  }

  restore() {
    const { fields, ...rest } = this.originalParams;
    this.setProps(rest);
    this.fields = fields;
    this.setFields(fields);
  }

  setNew(value: boolean, callback?: Callback) {
    if (this.isNew !== value) this.parmsLast = { ...this };
    this.isNew = value;
    if (this.component) {
      this.component.setState(
        state =>
          produce<State, State>(state, (draft): void => {
            draft.fieldsRender.isNew = value;
          }),
        callback,
      );
    }
  }

  setFields(fields: PropsField[], callback?: Callback) {
    if (this.component) {
      this.component.setState(
        state =>
          produce<State, State>(state, (draft): void => {
            draft.fieldsRender.fields = fields;
            this.fields = fields;
          }),
        callback,
      );
    }
  }

  getFieldsObject() {
    const fields: { [key: string]: any } = {};
    transformFields(this.fields).forEach(({ name, value }) => {
      fields[name] = value;
    });
    return fields;
  }

  changeField(callback?: Callback) {
    return ({ target }: EventField) => {
      const { value, name } = target;
      if (this.component && this.changeStateComponent) {
        this.setFields(
          changeValueFields({
            fields: this.fields,
            action: { name, value },
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
  }

  changeFields(callback?: Callback) {
    return (fields: EventField[]) => {
      const setState = this.changeStateComponent;
      this.changeStateComponent = false;
      fields.forEach(field => {
        this.changeField()(field);
      });
      this.changeStateComponent = setState;
      this.setFields(this.fields, callback);
    };
  }

  setValidation(validate: boolean, callback?: Callback) {
    if (this.component && this.changeStateComponent) {
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
  }

  setComponent(component: Component) {
    this.component = component;
  }
}
