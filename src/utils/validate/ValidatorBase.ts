import { observable } from 'mobx';
import FieldBuilder from '../builders/FieldBuilder';

class ValidatorBase {
  @observable public valid = true;
  public get inValid() {
    return !this.valid;
  }
  @observable public fields: FieldBuilder[];
  public _validate?: boolean;
  public get validate() {
    return this._validate;
  }

  public set validate(validate: boolean | undefined) {
    this._validate = validate;
  }

  constructor({ validate = false }: { validate?: boolean }) {
    this.validate = validate;
  }
}

export default ValidatorBase;
