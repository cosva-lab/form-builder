import produce from 'immer';
import {
  PropsField,
  PropsFieldObject,
  FieldsAll,
  Validation,
} from '../..';
import InputValidator from './InputValidator';
import { ComponentFormBuilder, StateFormBuilder } from '..';

import { Message } from '../../../MessagesTranslate/MessagesTranslate';

class InputsValidator {
  public inValid = false;
  public valid = true;
  public fields: PropsField[];
  public fieldsWithErros?: PropsField[];

  constructor(fields: FieldsAll) {
    this.fields = fields;
    this.callbackField = this.callbackField.bind(this);
    this.setErrorsComponent = this.setErrorsComponent.bind(this);
    this.addErrors = this.addErrors.bind(this);
    this.haveErrors = this.haveErrors.bind(this);
  }

  private setE(field: PropsField | PropsFieldObject) {
    field.validate = true;
    field.changed = true;
  }

  async callbackField(
    callback: (field: PropsField | PropsFieldObject) => void,
  ) {
    return produce<PropsField[], PropsField[]>(
      this.fields,
      async draft => {
        for (let key = 0; key < draft.length; key++) {
          await callback(draft[key]);
        }
      },
    );
  }

  async haveErrors() {
    this.inValid = false;
    this.valid = true;
    this.fieldsWithErros = await this.callbackField(async field => {
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
          field.error = error;
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

  setErrorsComponent(component: ComponentFormBuilder) {
    component.setState(state =>
      produce<StateFormBuilder, StateFormBuilder>(
        state,
        (draft): void => {
          draft.fieldsRender.validate = true;
          draft.fieldsRender.fields = this.fields;
        },
      ),
    );
  }

  async addErrors(
    errors: { [key: string]: string | string[] },
    component?: ComponentFormBuilder,
  ) {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const e = errors[key];
        const error: string[] = [];
        if (typeof e === 'string') {
          error.push(e);
        } else {
          error.push(...e);
        }
        this.fieldsWithErros = await this.callbackField(field => {
          const serverError = field.serverError || field.name;
          const serverErrors: string[] = [];
          if (typeof serverError === 'string') {
            serverErrors.push(serverError);
          } else if (serverError) {
            serverErrors.push(...serverError);
          }
          if (serverErrors.find(name => name === key)) {
            field.error = {
              message: error[0],
              state: true,
              errorServer: true,
            };
          }
        });
      }
    }
    component && this.setErrorsComponent(component);
    return this.fields;
  }
}

export default InputsValidator;
