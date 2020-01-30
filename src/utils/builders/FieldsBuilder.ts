import { observable, toJS } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import { changeValueFields } from '../changeValues';
import {
  GlobalProps,
  FieldsProps,
  EventField,
  PropsField,
} from '../../types';
import FieldBuilder from './FieldBuilder';

declare type Callback = Function;

declare type Props = FieldsProps;

interface Fields {
  [key: string]: any;
}

class FieldsBuilder extends InputsValidator implements FieldsProps {
  @observable public ns?: string;
  @observable public globalProps?: GlobalProps;
  @observable public actionsExtra?: object;
  public get values(): Fields {
    return this.getValues();
  }

  private originalParams: Props;
  private paramsLast?: Pick<
    FieldsProps,
    'fields' | 'ns' | 'validate'
  >;

  constructor(props: Props) {
    super(props);
    const { ns, validate } = props;
    for (const field of this.fields) {
      field.fieldsBuilder = this;
      if (!field.ns) field.ns = ns;
    }
    this.setProps({
      ns,
      validate,
    });
    this.originalParams = props;
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

  private setProps: (
    props: Pick<FieldsBuilder, 'ns'> & {
      validate?: boolean;
    },
  ) => void = ({ ns, validate = true }) => {
    this.ns = ns;
    this.validate = validate;
  };

  private setField(fieldOriginal: PropsField) {
    const field = this.fields.find(
      ({ name }) => fieldOriginal.name === name,
    );
    if (field) {
      field.fieldsBuilder = this;
      for (const key in fieldOriginal) {
        if (
          fieldOriginal.hasOwnProperty(key) &&
          field.hasOwnProperty(key)
        ) {
          field[key] = fieldOriginal[key];
        }
      }
    }
  }

  private setFields(fields: PropsField[]) {
    fields.forEach(fieldOriginal => this.setField(fieldOriginal));
  }

  saveData() {
    const { fields, ns, validate } = this;
    this.paramsLast = {
      fields: fields.map(
        (field): PropsField => FieldBuilder.formatParams(field),
      ),
      ns,
      validate,
    };
  }

  restore() {
    const { fields, ...rest } = this.originalParams;
    this.setProps(rest);
    this.setFields(fields);
  }

  restoreLast() {
    if (this.paramsLast) {
      const { fields, ...rest } = this.paramsLast;
      this.setProps(rest);
      this.setFields(fields);
      this.paramsLast = undefined;
    }
  }

  getValues<V extends Fields>() {
    const fields: V = Object.create(null);
    for (const { name, value, enabled } of toJS(this.fields)) {
      if (enabled) fields[name as keyof V] = value;
    }
    return fields;
  }

  /**
   * @deprecated 'Use getValues instead of getFieldsObject'
   */
  getFieldsObject() {
    return this.getValues();
  }

  get(fieldName: string) {
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
