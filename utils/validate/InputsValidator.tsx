import { observable } from 'mobx';
import {
  PropsField,
  PropsFieldObject,
  FieldsAll,
  Validation,
} from '../..';
import InputValidator from './InputValidator';

import { Message } from '../../../MessagesTranslate/MessagesTranslate';

class InputsValidator {
  @observable public inValid = false;
  @observable public valid = true;
  @observable public fields: PropsField[];

  constructor(fields: FieldsAll) {
    this.fields = observable(fields);
    this.callbackField = this.callbackField.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.haveErrors = this.haveErrors.bind(this);
  }

  private setE(field: PropsField | PropsFieldObject) {
    if (!field.validate) field.validate = true;
    if (!field.changed) field.changed = true;
  }

  async callbackField(
    callback: (field: PropsField | PropsFieldObject) => void,
  ) {
    const fields = this.fields;
    for (const field of this.fields) {
      await callback(field);
    }
    return fields;
  }

  async haveErrors() {
    this.inValid = false;
    this.valid = true;
    await this.callbackField(async field => {
      this.setE(field);
      try {
        if (
          field.error &&
          field.error.state &&
          !field.error.errorServer
        )
          throw new Error();
        const validationsObj: Validation[] = [];
        const setError = (error: Message) => {
          field.error = observable(error);
          if (error.state && !this.inValid) throw new Error();
        };

        const { fields } = this;
        field.validations &&
          field.validations.forEach(validation => {
            if (typeof validation === 'object') {
              validationsObj.push(validation);
            } else {
              setError(
                validation({ fields }) || {
                  state: false,
                  message: '',
                },
              );
            }
          });

        const validation = new InputValidator(validationsObj);
        const message = await validation.haveErrors(field);
        setError(message);
      } catch (e) {
        this.inValid = true;
        this.valid = false;
      }
    });
    return this.inValid;
  }

  async addErrors(errors: { [key: string]: string | string[] }) {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const e = errors[key];
        const error: string[] = [];
        if (typeof e === 'string') {
          error.push(e);
        } else {
          error.push(...e);
        }
        await this.callbackField(field => {
          const serverError = field.serverError || field.name;
          const serverErrors: string[] = [];
          if (typeof serverError === 'string') {
            serverErrors.push(serverError);
          } else if (serverError) {
            serverErrors.push(...serverError);
          }
          if (serverErrors.find(name => name === key)) {
            field.error = observable({
              message: error[0],
              state: true,
              errorServer: true,
            });
          }
        });
      }
    }
    return this.fields;
  }
}

export default InputsValidator;
