import validator from 'validator';
import { Step } from '../..';

class InputValidator {
  validate({ step }: { step: Step }) {
    const { fields } = step;
    let v = true;
    if (fields) {
      fields.forEach(field => {
        const { validation, value = '', state = true } = field;
        if (validation && state) {
          validation.forEach(rule => {
            const args = rule.args || [];
            const validationMethod =
              typeof rule.rule === 'string'
                ? validator[rule.rule]
                : rule.rule;
            let bolean = false;
            switch (rule.rule) {
              case 'isEmpty':
                bolean = true;
                break;
              default:
                break;
            }
            if (
              validationMethod(value.toString(), args) === bolean &&
              state
            ) {
              if (v) {
                v = false;
              }
            }
          });
        }
        return null;
      });
    }
    return v;
  }
}

export default InputValidator;
