import produce from 'immer';
import {
  PropsField,
  PropsFieldObject,
  FieldsAll,
  Fields,
} from '../..';
import InputValidator from './InputValidator';
import transformFields from '../transformFields';
import { Component, State } from '..';
class InputsValidator {
  public inValid = false;
  public valid = true;
  public fields: Fields;
  private fieldsWithErros: Fields;

  constructor(fields: FieldsAll) {
    this.fields = transformFields(fields);
    this.fieldsWithErros = transformFields(fields);
  }

  private setE(field: PropsField | PropsFieldObject) {
    field.validate = true;
    field.changed = true;
  }

  callbackField = (
    callback: (field: PropsField | PropsFieldObject) => void,
  ) => {
    return produce<Fields, Fields>(this.fields, (draft): void => {
      for (let key = 0; key < draft.length; key++) {
        callback(draft[key]);
      }
    });
  };

  haveErrors() {
    this.inValid = false;
    this.valid = true;
    this.fieldsWithErros = this.callbackField(field => {
      this.setE(field);
      try {
        if (field.error && field.error.state) throw new Error();
        const validation = new InputValidator(
          field.validations || [],
        );
        const error = validation.haveErrors(field);
        field.error = error;
        if (error.state && !this.inValid) throw new Error();
      } catch (e) {
        this.inValid = true;
        this.valid = false;
      }
    });
    return this.inValid;
  }

  setErrors = (component: Component) => {
    component.setState(state =>
      produce<State, State>(state, (draft): void => {
        draft.fieldsRender.validate = true;
        draft.fieldsRender.fields = this.fieldsWithErros;
      }),
    );
  };

  addErrors = (errors: { [key: string]: string | string[] }) => {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const e = errors[key];
        const error: string[] = [];
        if (typeof e === 'string') {
          error.push(e);
        } else {
          error.push(...e);
        }
        this.fields = this.callbackField(field => {
          const serverError = field.serverError || field.name;
          const serverErrors: string[] = [];
          if (typeof serverError === 'string') {
            serverErrors.push(serverError);
          } else if (serverError) {
            serverErrors.push(...serverError);
          }
          if (serverErrors.find(name => name === key)) {
            field.error = { message: error[0], state: true };
          }
        });
      }
    }
    return this.fields;
  };
}

export default InputsValidator;
