import { observable, toJS, makeObservable, action } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import type {
  GlobalProps,
  FieldsProps,
  EventField,
  PropsField,
  value,
} from '../../types';
import StepsBuilder from './StepsBuilder';
import FieldBuilder from './FieldBuilder';
import { EventChangeValue, OnChangeFieldEvent } from '../../types';

declare type Callback = Function;

declare type Props = FieldsProps;

interface Fields {
  [key: string]: any;
}

export class FieldsBuilder<
    Name extends string,
    Item extends PropsField,
    Input extends Item[],
  >
  extends InputsValidator<Name, Item, Input>
  implements FieldsProps
{
  @observable public stepsBuilder?: StepsBuilder;
  @observable private _ns?: string = undefined;
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
    makeObservable(this);
    const { ns, globalProps } = props;
    this._ns = ns;
    this.globalProps = globalProps;
    for (const field of this.fields) {
      field.fieldsBuilder = this;
    }
    this.validate = this._validate;
    this.saveData = this.saveData.bind(this);
    this.restore = this.restore.bind(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeFields = this.onChangeFields.bind(this);
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
    fields.forEach((fieldOriginal) => this.setField(fieldOriginal));
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
    return this.fieldsMap[fieldName];
  }

  @action
  onChangeField(event: EventField) {
    const { value, name } = event;
    const field = this.get(name);
    if (field) field.setValue(value);
    else console.warn(`Field ${name} not found`);
  }

  @action
  onChangeFields(events: EventField[]) {
    events.forEach((field) => this.onChangeField(field));
  }

  @action
  changeValue({ name, value }: EventChangeValue) {
    const field = this.get(name);
    if (field) field.value = value;
    else console.warn(`Field ${name} not found`);
  }

  @action
  changeValues(events: EventChangeValue[]) {
    events.forEach((event) => this.changeValue(event));
  }

  @action
  setValidation(validate: boolean, callback?: Callback) {
    this.validate = validate;
    callback && callback();
  }
}

export default FieldsBuilder;
