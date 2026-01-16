import { observable, toJS, makeObservable, action } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import type {
  FieldsProps,
  EventField,
  PropsField,
  EventChangeValue,
  GetArrayValues,
  FieldType,
  FieldsToObject,
  GetFieldsValue,
} from '../../types';
import type FieldBuilder from './FieldBuilder';

export class FieldsBuilder<
  Fields extends FieldBuilder<any>[],
> extends InputsValidator<Fields> {
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
    FieldsProps<Fields>,
    'fields' | 'ns' | 'validate'
  >;

  constructor(props: FieldsProps<Fields>) {
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

  private setField(fieldOriginal: PropsField<FieldType>) {
    const field = this.fields.find(
      ({ name }) => fieldOriginal.name === name,
    );
    if (field) {
      field.fieldsBuilder = this as any;
      field.value = fieldOriginal.value;
      field.errors = fieldOriginal.errors;
    }
  }

  private setFields(fields: PropsField<FieldType>[]) {
    fields.forEach((fieldOriginal) => this.setField(fieldOriginal));
  }

  saveData() {
    const { fields, ns, validate } = this;
    this.paramsLast = {
      fields: toJS(fields as any),
      ns,
      validate: validate as any,
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
      [Key in keyof GetFieldsValue<Fields>]: GetFieldsValue<Fields>[Key];
    } = Object.create(null);
    for (const { name, value } of this.fields)
      values[name as keyof GetFieldsValue<Fields>] =
        value as GetFieldsValue<Fields>[keyof GetFieldsValue<Fields>];
    return toJS(values);
  }

  get<FieldName extends keyof FieldsToObject<Fields>>(
    fieldName: FieldName,
  ): FieldsToObject<Fields>[FieldName] {
    return this.fieldsMap[fieldName];
  }

  getField<FieldName extends keyof FieldsToObject<Fields>>(
    fieldName: FieldName,
  ): FieldsToObject<Fields>[FieldName] {
    return this.fieldsMap[fieldName];
  }

  @action
  onChangeField<FieldName extends keyof GetFieldsValue<Fields>>(
    event: EventField<GetFieldsValue<Fields>[FieldName], FieldName>,
  ) {
    const { value, name } = event;
    const field = this.fieldsMap[name] as FieldBuilder<
      PropsField<FieldType>
    >;
    if (field) field.setValue(value as any);
    else console.warn(`Field ${name.toString()} not found`);
  }

  @action
  onChangeFields<Values extends GetFieldsValue<Fields>>(
    events: GetArrayValues<{
      [Field in keyof Values]: EventField<Values[Field], Field>;
    }>,
  ) {
    events.forEach((event) => this.onChangeField(event as any));
  }

  @action
  changeValue<FieldName extends keyof GetFieldsValue<Fields>>({
    name,
    value,
  }: EventChangeValue<GetFieldsValue<Fields>[FieldName], FieldName>) {
    const field = this.get(name as FieldName) as FieldBuilder<
      PropsField<FieldType>
    >;
    if (field) field.setValue(value);
    else console.warn(`Field ${name.toString()} not found`);
  }
  @action
  changeValues(
    events: {
      [K in keyof GetFieldsValue<Fields>]: EventChangeValue<
        GetFieldsValue<Fields>[K],
        K
      >;
    }[keyof GetFieldsValue<Fields>][],
  ) {
    events.forEach((event) => this.changeValue(event));
  }

  @action
  setValidation(validate: boolean) {
    this.validate = validate;
  }
}

export default FieldsBuilder;
