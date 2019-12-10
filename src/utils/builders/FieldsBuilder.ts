import { observable } from 'mobx';
import InputsValidator from '../validate/InputsValidator';
import { changeValueFields } from '../changeValues';
import {
  extra,
  transPosition,
  FieldsRenderProps,
  EventField,
} from '../../types';

function extend(from: any, to?: any) {
  if (from === null || typeof from !== 'object') return from;
  if (from.constructor !== Object && from.constructor !== Array)
    return from;
  if (
    from.constructor === Date ||
    from.constructor === RegExp ||
    from.constructor === Function ||
    from.constructor === String ||
    from.constructor === Number ||
    from.constructor === Boolean
  )
    return new from.constructor(from);

  to = to || new from.constructor();
  for (const name in from) {
    if (from.hasOwnProperty(name)) {
      to[name] =
        typeof to[name] === 'undefined'
          ? extend(from[name], null)
          : to[name];
    }
  }
  return to;
}
declare type Callback = () => void;

declare type Props = FieldsRenderProps;

class FieldsBuilder extends InputsValidator
  implements FieldsRenderProps {
  @observable public ns?: string;
  @observable public isNew?: boolean;
  @observable public validationState?: boolean;
  @observable public validate?: boolean;
  @observable public extra?: extra;
  @observable public actionsExtra?: object;
  @observable public transPosition?: transPosition;

  private originalParams: FieldsBuilder;
  private parmsLast?: Pick<
    FieldsBuilder,
    'fields' | 'ns' | 'isNew' | 'validationState' | 'validate'
  >;

  constructor(props: Props) {
    super(props.fields);
    const { ns, isNew, validationState, validate } = props;
    for (const field of this.fields) {
      field.fields = this;
    }
    this.setProps({
      ns,
      isNew,
      validationState,
      validate,
    });
    this.originalParams = extend(props);
    for (const funsds in this) {
      if (this.hasOwnProperty(funsds)) {
        const element = this[funsds];
        if (typeof element === 'function') {
          element.bind(this);
        }
      }
    }
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

  restoreLast = () => {
    if (this.parmsLast) {
      const { fields, ...rest } = this.parmsLast;
      this.setProps(rest);
      this.fields = fields;
      this.parmsLast = undefined;
    }
  };

  saveData = () => {
    const { fields, ns, isNew, validationState, validate } = this;
    this.parmsLast = extend({
      fields,
      ns,
      isNew,
      validationState,
      validate,
    });
  };

  restore = () => {
    const { fields, ...rest } = this.originalParams;
    this.setProps(rest);
    this.fields = fields;
  };

  setNew = (value: boolean, callback?: Callback) => {
    this.isNew = value;
    callback && callback();
  };

  getFieldsObject = () => {
    const fields: {
      [key: string]: any;
    } = {};
    [...this.fields].forEach(({ name, value }) => {
      fields[name] = value;
    });
    return fields;
  };

  changeField = (callback?: (event: EventField) => void) => {
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
  };

  changeFields = (callback?: Callback) => {
    return (fields: EventField[]) => {
      fields.forEach(field => {
        this.changeField()(field);
      });
      callback && callback();
    };
  };

  setValidation = (validate: boolean, callback?: Callback) => {
    this.validate = validate;
    callback && callback();
  };

  setErrors = async (errors?: {
    [key: string]: string | string[];
  }) => {
    errors && (await this.addErrors(errors));
    if (!this.validate) this.validate = true;
  };
}

export default FieldsBuilder;
