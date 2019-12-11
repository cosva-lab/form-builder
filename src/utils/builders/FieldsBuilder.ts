import { observable, toJS } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import { changeValueFields } from '../changeValues';
import {
  extra,
  transPosition,
  FieldsRenderProps,
  EventField,
  PropsField,
} from '../../types';
import FieldBuilder from './FieldBuilder';

declare type Callback = Function;

declare type Props = FieldsRenderProps;

class FieldsBuilder extends InputsValidator
  implements FieldsRenderProps {
  @observable public ns?: string;
  @observable public isNew?: boolean;
  @observable public extra?: extra;
  @observable public actionsExtra?: object;
  @observable public transPosition?: transPosition;

  private originalParams: Props;
  private parmsLast?: Pick<
    Props,
    'fields' | 'ns' | 'isNew' | 'validate'
  >;

  constructor(props: Props) {
    super(props);
    const { ns, isNew, validate } = props;
    for (const field of this.fields) {
      field.fieldsBuilder = this;
      if (!field.ns) field.ns = ns;
    }
    this.setProps({
      ns,
      isNew,
      validate,
    });
    this.originalParams = props;
    this.saveData = this.saveData.bind(this);
    this.restore = this.restore.bind(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.setNew = this.setNew.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeFields = this.changeFields.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setErrorsasync = this.setErrorsasync.bind(this);
  }

  private setProps: (
    props: Pick<FieldsBuilder, 'ns' | 'isNew'> & {
      validate?: boolean;
    },
  ) => void = ({ ns, isNew, validate = true }) => {
    this.ns = ns;
    this.isNew = isNew;
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
    const { fields, ns, isNew, validate } = this;
    this.parmsLast = {
      fields: fields.map(
        (field): PropsField => FieldBuilder.formatParams(field),
      ),
      ns,
      isNew,
      validate,
    };
  }

  restore() {
    const { fields, ...rest } = this.originalParams;
    this.setProps(rest);
    this.setFields(fields);
  }

  restoreLast() {
    if (this.parmsLast) {
      const { fields, ...rest } = this.parmsLast;
      this.setProps(rest);
      this.setFields(fields);
      this.parmsLast = undefined;
    }
  }

  setNew(value: boolean, callback?: Callback) {
    this.isNew = value;
    callback && callback();
  }

  getFieldsObject() {
    const fields: {
      [key: string]: any;
    } = {};
    for (const { name, value } of toJS(this.fields)) {
      fields[name] = value;
    }
    return fields;
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

  async setErrorsasync(errors?: Record<string, string | string[]>) {
    errors && errors.errors && (await this.addErrors(errors));
    if (!this.validate) this.validate = true;
  }
}

export default FieldsBuilder;
