import { Validation, AllPropsValidationFunction } from '../..';
import { ValidationFunction, Message } from '../..';
import { value, Validate } from '../../types';
import { observable } from 'mobx';

class InputValidator<V = value> implements Validate<V> {
  @observable public validate?: boolean;
  @observable public value: V;
  @observable public validations?: (
    | Validation
    | ValidationFunction<V>
  )[];
  @observable public changed?: boolean;
  @observable public validChange?: boolean;
  @observable public state?: boolean;

  constructor({
    changed,
    state = true,
    validChange,
    validate,
    validations,
    value,
  }: Validate<V>) {
    this.changed = changed;
    this.state = state;
    this.validChange = validChange;
    this.validate = validate;
    this.validations = validations;
    this.value = value;
    // validations is an array of validation rules specific to a form
    this.haveErrors = this.haveErrors.bind(this);
  }

  async haveErrors(
    props?: AllPropsValidationFunction,
  ): Promise<Message> {
    const {
      changed,
      validChange,
      validate,
      validations,
      value,
      state,
    } = this;
    const { activeStep, fields, steps } = { ...props };
    let messageResult: Message = {
      state: false,
      message: '',
    };
    if (!validate && !changed && !state) {
      return messageResult;
    }

    if (Array.isArray(validations) && (validChange || validate)) {
      for (const validation of validations) {
        if (typeof validation === 'object') {
          let rule = validation.rule || 'isEmpty';
          const {
            message,
            ns = 'validations',
            props = { attribute: '' },
            args = [],
          } = validation;
          if (
            ![
              'toDate',
              'toFloat',
              'toInt',
              'toBoolean',
              'equals',
              'contains',
              'matches',
              'isEmail',
              'isURL',
              'isMACAddress',
              'isIP',
              'isIPRange',
              'isFQDN',
              'isBoolean',
              'isAlpha',
              'isAlphaLocales',
              'isAlphanumeric',
              'isAlphanumericLocales',
              'isNumeric',
              'isPort',
              'isLowercase',
              'isUppercase',
              'isAscii',
              'isFullWidth',
              'isHalfWidth',
              'isVariableWidth',
              'isMultibyte',
              'isSurrogatePair',
              'isInt',
              'isFloat',
              'isFloatLocales',
              'isDecimal',
              'isHexadecimal',
              'isDivisibleBy',
              'isHexColor',
              'isISRC',
              'isMD5',
              'isHash',
              'isJWT',
              'isJSON',
              'isEmpty',
              'isLength',
              'isByteLength',
              'isUUID',
              'isMongoId',
              'isAfter',
              'isBefore',
              'isIn',
              'isCreditCard',
              'isIdentityCard',
              'isISIN',
              'isISBN',
              'isISSN',
              'isMobilePhone',
              'isMobilePhoneLocales',
              'isPostalCode',
              'isPostalCodeLocales',
              'isCurrency',
              'isISO8601',
              'isRFC3339',
              'isISO31661Alpha2',
              'isBase64',
              'isDataURI',
              'isMagnetURI',
              'isMimeType',
              'isLatLong',
              'ltrim',
              'rtrim',
              'trim',
              'escape',
              'unescape',
              'stripLow',
              'whitelist',
              'blacklist',
              'isWhitelisted',
              'normalizeEmail',
              'toString',
            ].includes(rule)
          ) {
            console.error(rule, `the rule don't exists`);
            rule = 'isEmpty';
          } else {
            const validator = await import('validator').catch(
              () => undefined,
            );
            if (validator && validator[rule]) {
              const validationMethod: any = validator[rule];
              let bolean = false;
              switch (rule) {
                case 'isEmpty':
                  bolean = true;
                  break;
                default:
                  break;
              }
              try {
                if (
                  validationMethod((value || '').toString(), args) ===
                  bolean
                ) {
                  messageResult = {
                    state: true,
                    message,
                    ns,
                    props,
                  };
                  break;
                }
              } catch (error) {
                break;
              }
            }
          }
        } else {
          const temPError = (await validation({
            fields,
            steps,
            activeStep,
            value,
            validChange,
            changed,
            validate,
          })) || {
            state: false,
            message: '',
          };
          if (temPError.state) {
            messageResult = temPError;
            break;
          }
        }
      }
    }
    return messageResult;
  }
}

export default InputValidator;
