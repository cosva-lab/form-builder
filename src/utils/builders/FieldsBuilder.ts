import { observable, toJS } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import { changeValueFields } from '../changeValues';
import {
  GlobalProps,
  FieldsProps,
  EventField,
  PropsField,
  value,
} from '../../types';
import StepsBuilder from './StepsBuilder';
import FieldBuilder from './FieldBuilder';

declare type Callback = Function;

declare type Props = FieldsProps;

interface Fields {
  [key: string]: any;
}

class FieldsBuilder extends InputsValidator implements FieldsProps {
  @observable public stepsBuilder?: StepsBuilder;
  @observable private _ns?: string;
  public get ns(): string | undefined {
    return typeof this._ns === 'undefined'
      ? this.stepsBuilder && this.stepsBuilder.ns
      : this._ns;
  }

  public set ns(ns: string | undefined) {
    this._ns = ns;
  }

  public globalProps?: GlobalProps;
  @observable public actionsExtra?: object;
  public get values(): Fields {
    return this.getValues();
  }

  private paramsLast?: Pick<
    FieldsProps,
    'fields' | 'ns' | 'validate'
  >;

  constructor(props: Props) {
    super(props);
    const { ns, validate = true, globalProps } = props;
    this._ns = ns;
    this._validate = validate;
    this.globalProps = globalProps;
    for (const field of this.fields) {
      field.fieldsBuilder = this;
    }
    this.saveData = this.saveData.bind(this);
    this.restore = this.restore.bind(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeFields = this.changeFields.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.getValues = this.getValues.bind(this);
  }

  private setField(fieldOriginal: PropsField) {
    const field = this.fields.find(
      ({ name }) => fieldOriginal.name === name,
    );
    if (field) {
      field.fieldsBuilder = this;
      field.value = fieldOriginal.value;
      field.errors = fieldOriginal.errors;
    }
  }

  private setFields(fields: PropsField[]) {
    fields.forEach(fieldOriginal => this.setField(fieldOriginal));
  }

  saveData() {
    const { fields, ns, validate } = this;
    this.paramsLast = {
      fields: fields.map((field): PropsField => toJS(field)),
      ns,
      validate,
    };
  }

  restore() {
    for (const field of this.fields) {
      field.reset();
    }
  }

  restoreLast() {
    if (this.paramsLast) {
      const { fields } = this.paramsLast;
      this.setFields(fields);
      this.paramsLast = undefined;
    }
  }

  getValues<V extends Fields>() {
    const fields: V = Object.create(null);
    for (const { name, value, enabled } of this.fields)
      if (enabled) fields[name as keyof V] = value;
    return toJS(fields);
  }

  /**
   * @deprecated 'Use getValues instead of getFieldsObject'
   */
  getFieldsObject() {
    return this.getValues();
  }

  get<V = value>(fieldName: string): FieldBuilder<V> | undefined {
    return this.fields.find(({ name }) => name === fieldName);
  }

  changeField(callback?: (event: EventField) => void) {
    return (event: EventField, callbackEvent?: Callback) => {
      const { value, name } = event.target;
      changeValueFields({
        fieldsBuilder: this,
        action: {
          name,
          value,
        },
      });
      callback && callback(event);
      callbackEvent && callbackEvent();
    };
  }

  changeFields(callback?: Callback) {
    return (fields: EventField[]) => {
      fields.forEach(field => {
        this.changeField()(field);
      });
      callback && callback();
    };
  }

  setValidation(validate: boolean, callback?: Callback) {
    this.validate = validate;
    callback && callback();
  }
}

export default FieldsBuilder;
