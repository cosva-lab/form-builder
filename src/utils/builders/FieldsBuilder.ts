import { observable, toJS, makeObservable, action } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import type {
  FieldsProps,
  EventField,
  PropsField,
  EventChangeValue,
  NameField,
  GetArrayValues,
  value,
} from '../../types';
import { Reducer } from '../types';
import { GetFields } from '../../types';

export class FieldsBuilder<
  Name extends NameField = any,
  Item extends PropsField<value, Name> = PropsField<value, Name>,
  Fields extends Item[] = Item[],
  FieldsObject = Reducer<Fields>,
  Partial = false,
> extends InputsValidator<Name, Item, Fields, FieldsObject> {
  @observable private _ns?: string = undefined;

  public get ns(): string | undefined {
    return this._ns;
  }

  public set ns(ns: string | undefined) {
    this._ns = ns;
  }

  @observable public actionsExtra?: object;
  public get values() {
    return this.getValues();
  }

  private paramsLast?: Pick<
    FieldsProps<Name, Item, Fields, FieldsObject>,
    'fields' | 'ns' | 'validate'
  >;

  constructor(props: FieldsProps<Name, Item, Fields, FieldsObject>) {
    super(props);
    makeObservable(this);
    const { ns } = props;
    this._ns = ns;

    for (const field of this.fields) {
      field.fieldsBuilder = this as any;
    }
    this.validate = this._validate;
    this.saveData = this.saveData.bind(this);
    this.restore = this.restore.bind(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeFields = this.onChangeFields.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.getValues = this.getValues.bind(this);
    this.get = this.get.bind(this);
    this.getField = this.getField.bind(this);
  }

  private setField(fieldOriginal: PropsField<value, NameField, any>) {
    const field = this.fields.find(
      ({ name }) => fieldOriginal.name === name,
    );
    if (field) {
      field.fieldsBuilder = this as any;
      field.value = fieldOriginal.value;
      field.errors = fieldOriginal.errors;
    }
  }

  private setFields(fields: PropsField<value, NameField, any>[]) {
    fields.forEach((fieldOriginal) => this.setField(fieldOriginal));
  }

  saveData() {
    const { fields, ns, validate } = this;
    this.paramsLast = {
      fields: toJS(fields as any),
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
      this.setFields(fields as any);
      this.paramsLast = undefined;
    }
  }

  getValues() {
    const values: {
      [Key in keyof FieldsObject]: FieldsObject[Key];
    } = Object.create(null);
    for (const { name, value } of this.fields) values[name] = value;
    return toJS(values);
  }

  get<FieldName extends keyof FieldsObject>(
    fieldName: FieldName,
  ):
    | (Partial extends true ? undefined : never)
    | GetFields<FieldsObject>[FieldName] {
    return this.fieldsMap[fieldName];
  }

  getField<FieldName extends keyof FieldsObject>(
    fieldName: FieldName,
  ):
    | (Partial extends true ? undefined : never)
    | GetFields<FieldsObject>[FieldName] {
    return this.fieldsMap[fieldName];
  }

  @action
  onChangeField<Field extends keyof FieldsObject>(
    event: EventField<FieldsObject[Field], Field>,
  ) {
    const { value, name } = event;
    const field = this.fieldsMap[name];
    if (field) field.setValue(value);
    else console.warn(`Field ${name.toString()} not found`);
  }

  @action
  onChangeFields<Fields extends keyof FieldsObject>(
    events: GetArrayValues<{
      [Field in Fields]: EventField<FieldsObject[Field], Field>;
    }>,
  ) {
    events.forEach((event) => this.onChangeField(event));
  }

  @action
  changeValue({ name, value }: EventChangeValue) {
    const field = this.get(name as keyof FieldsObject);
    if (field) field.value = value;
    else console.warn(`Field ${name} not found`);
  }

  @action
  changeValues(events: EventChangeValue[]) {
    events.forEach((event) => this.changeValue(event));
  }

  @action
  setValidation(validate: boolean) {
    this.validate = validate;
  }
}

export default FieldsBuilder;
