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
    this._ns = props.ns;

    for (const field of this.fields) {
      field.fieldsBuilder = this as any;
    }
    this.validate = this._validate;
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

  @action.bound
  public saveData() {
    this.paramsLast = {
      fields: toJS(this.fields as any),
      ns: this.ns,
      validate: this.validate as any,
    };
  }

  @action.bound
  public restore() {
    this.fields.forEach((field) => field.reset());
  }

  @action.bound
  public restoreLast() {
    if (this.paramsLast) {
      this.setFields(this.paramsLast.fields as any);
      this.paramsLast = undefined;
    }
  }

  @action.bound
  public getValues(): GetFieldsValue<Fields> {
    const values = this.fields.reduce((acc, { name, value }) => {
      acc[name as keyof GetFieldsValue<Fields>] = value as any;
      return acc;
    }, {} as GetFieldsValue<Fields>);

    return toJS(values);
  }

  @action.bound
  public get<FieldName extends keyof FieldsToObject<Fields>>(
    fieldName: FieldName,
  ): FieldsToObject<Fields>[FieldName] {
    return this.fieldsMap[fieldName];
  }

  @action.bound
  public getField<FieldName extends keyof FieldsToObject<Fields>>(
    fieldName: FieldName,
  ): FieldsToObject<Fields>[FieldName] {
    return this.get(fieldName);
  }

  @action.bound
  public onChangeField<
    FieldName extends keyof GetFieldsValue<Fields>,
  >(event: EventField<GetFieldsValue<Fields>[FieldName], FieldName>) {
    this.changeValue(event as any);
  }

  @action.bound
  public onChangeFields<Values extends GetFieldsValue<Fields>>(
    events: GetArrayValues<{
      [Field in keyof Values]: EventField<Values[Field], Field>;
    }>,
  ) {
    events.forEach((event) => this.onChangeField(event as any));
  }

  @action.bound
  public changeValue<FieldName extends keyof GetFieldsValue<Fields>>({
    name,
    value,
  }: EventChangeValue<GetFieldsValue<Fields>[FieldName], FieldName>) {
    const field = this.get(
      name as any,
    ) as unknown as FieldBuilder<any>;
    if (field) {
      field.setValue(value);
    } else {
      console.warn(`Field ${name.toString()} not found`);
    }
  }

  @action.bound
  public changeValues(
    events: {
      [K in keyof GetFieldsValue<Fields>]: EventChangeValue<
        GetFieldsValue<Fields>[K],
        K
      >;
    }[keyof GetFieldsValue<Fields>][],
  ) {
    events.forEach((event) => this.changeValue(event));
  }

  @action.bound
  public setValidation(validate: boolean) {
    this.validate = validate;
  }
}

export default FieldsBuilder;
