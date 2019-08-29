import produce from 'immer';
import { FieldsRenderProps, EventField, PropsField } from '..';
import InputsValidator from './validate/InputsValidator';
import { ComponentFormBuilder, StateFormBuilder } from '.';
import { changeValueFields } from './changeValues';
import cloneDeep from 'lodash/cloneDeep';

declare type Callback = () => void;

declare interface Props extends FieldsRenderProps {
  changeStateComponent?: boolean;
}

export default class FieldsBuilder extends InputsValidator {
  ns?: string;
  isNew?: boolean;
  validationState?: boolean;
  validate?: boolean;
  private component?: ComponentFormBuilder;
  private originalParams: FieldsBuilder;
  private parmsLast?: FieldsBuilder;
  private changeStateComponent: boolean;

  constructor(props: Props) {
    super(props.fields);
    const {
      ns,
      isNew,
      validationState,
      validate,
      changeStateComponent = false,
    } = props;
    this.setProps({
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

  setChangeStateComponent = (changeStateComponent: boolean) => {
    this.changeStateComponent = changeStateComponent;
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
    if (this.component) {
      this.component.setState(
        state =>
          produce<StateFormBuilder, StateFormBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.isNew = value;
            },
          ),
        callback,
      );
    }
  }

  setFields(fields: PropsField[], callback?: Callback) {
    this.fields = fields;
    if (this.component) {
      this.component.setState(
        state =>
          produce<StateFormBuilder, StateFormBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.fields = fields;
            },
          ),
        callback,
      );
    } else {
      callback && callback();
    }
  }

  getFieldsObject() {
    const fields: {
      [key: string]: any;
    } = {};
    this.fields.forEach(({ name, value }) => {
      fields[name] = value;
    });
    return fields;
  }

  changeField(callback?: Callback) {
    return ({ target }: EventField) => {
      const { value, name } = target;
      const fields = changeValueFields({
        fields: this.fields,
        action: {
          name,
          value,
        },
      });
      if (this.component && this.changeStateComponent) {
        this.setFields(fields, callback);
      }
      this.fields = fields;
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
          produce<StateFormBuilder, StateFormBuilder>(
            state,
            (draft): void => {
              draft.fieldsRender.validate = validate;
            },
          ),
        callback,
      );
    }
    this.validate = validate;
  }

  setErrors() {
    if (this.component && this.changeStateComponent) {
      this.component.setState(state =>
        produce<StateFormBuilder, StateFormBuilder>(
          state,
          (draft): void => {
            draft.fieldsRender.validate = true;
            draft.fieldsRender.fields = this.fieldsWithErros;
          },
        ),
      );
    }
    this.validate = true;
    this.fields = this.fieldsWithErros;
  }

  setComponent(component: ComponentFormBuilder) {
    this.component = component;
  }
}
