import { observable } from 'mobx';
import { FieldsRenderProps, EventField, PropsField } from '..';
import InputsValidator from './validate/InputsValidator';
import { changeValueFields } from './changeValues';
import cloneDeep from 'lodash/cloneDeep';

declare type Callback = () => void;

declare type Props = FieldsRenderProps;
export default class FieldsBuilder extends InputsValidator {
  @observable public ns?: string;
  @observable public isNew?: boolean;
  @observable public validationState?: boolean;
  @observable public validate?: boolean;
  @observable private originalParams: FieldsBuilder;
  @observable private parmsLast?: FieldsBuilder;

  constructor(props: Props) {
    super(props.fields);
    const { ns, isNew, validationState, validate } = props;
    this.setProps({
      ns,
      isNew,
      validationState,
      validate,
    });
    this.originalParams = cloneDeep(this);
    this.restoreLast = this.restoreLast.bind(this);
    this.restore = this.restore.bind(this);
    this.getFieldsObject = this.getFieldsObject.bind(this);
    this.setNew = this.setNew.bind(this);
    this.setFields = this.setFields.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeFields = this.changeFields.bind(this);
    this.setValidation = this.setValidation.bind(this);
    this.setErrors = this.setErrors.bind(this);
  }

  private setProps: (
    props: Pick<
      FieldsBuilder,
      'ns' | 'isNew' | 'validationState' | 'validate'
    >,
  ) => void = ({ ns, isNew, validationState, validate }) => {
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
    if (this.isNew !== value)
      this.parmsLast = {
        ...this,
      };
    this.isNew = value;
    callback && callback();
  }

  setFields(fields: PropsField[], callback?: Callback) {
    this.fields = fields;
    callback && callback();
  }

  getFieldsObject() {
    const fields: {
      [key: string]: any;
    } = {};
    [...this.fields].forEach(({ name, value }) => {
      fields[name] = value;
    });
    return fields;
  }

  changeField(callback?: Callback) {
    return ({ target }: EventField, callbackEvent?: Callback) => {
      const { value, name } = target;
      changeValueFields({
        fields: this.fields,
        action: {
          name,
          value,
        },
      });
      callback && callback();
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

  async setErrors(errors?: { [key: string]: string | string[] }) {
    errors && (await this.addErrors(errors));
    if (!this.validate) this.validate = true;
  }
}
