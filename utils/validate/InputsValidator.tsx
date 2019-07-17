import produce from 'immer';
import { Fields, EventField } from '../..';
import InputValidator from './InputValidator';
import { changeValueFields } from '../changeValues';
import FormBuilder from '../FormBuilder';
interface State {
  fieldsRender: FormBuilder;
}
declare type Component = React.Component<unknown, State>;
class InputsValidator {
  public inValid = false;
  public valid = true;
  public fields: Fields;
  private fieldsWithErros: Fields;

  constructor(fields: Fields) {
    this.fields = fields;
    this.fieldsWithErros = fields;
  }

  haveErrors() {
    const fields = this.fields;
    this.fieldsWithErros = produce<Fields, Fields>(
      fields,
      (draft): void => {
        if (Array.isArray(draft)) {
          for (let index = 0; index < draft.length; index++) {
            const validation = new InputValidator(
              draft[index].validations || [],
            );
            draft[index].validate = true;
            draft[index].changed = true;
            const error = validation.haveErrors(draft[index]);
            draft[index].error = error;
            if (error.state && !this.inValid) {
              this.inValid = true;
              this.valid = false;
            }
          }
        } else {
          for (const key in draft) {
            if (draft.hasOwnProperty(key)) {
              const validation = new InputValidator(
                draft[key].validations || [],
              );

              draft[key].validate = true;
              draft[key].changed = true;
              const error = validation.haveErrors(draft[key]);
              draft[key].error = error;
              if (error.state && !this.inValid) {
                this.inValid = true;
                this.valid = false;
              }
            }
          }
        }
      },
    );
    return this.inValid;
  }

  handleChange = (component: Component) => ({
    target,
  }: EventField) => {
    const { value, name } = target;
    component.setState(state =>
      produce<State, State>(state, (draft): void => {
        const fields = draft.fieldsRender.fields;
        draft.fieldsRender.fields = changeValueFields({
          fields: fields,
          action: { name, value },
        });
      }),
    );
  };

  addErrors = (component: Component) => {
    component.setState(state =>
      produce<State, State>(state, (draft): void => {
        draft.fieldsRender.validate = true;
        draft.fieldsRender.fields = this.fieldsWithErros;
      }),
    );
  };
}

export default InputsValidator;
