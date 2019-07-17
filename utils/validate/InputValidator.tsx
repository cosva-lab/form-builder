import validator from 'validator';
import { Validation, Validate } from '../..';
import { Message } from '../../../MessagesTranslate/Animation';

class InputValidator {
  public validations: Validation[] = [];

  constructor(validations: Validation[]) {
    // validations is an array of validation rules specific to a form
    this.validations = validations;
  }

  haveErrors({
    value,
    validChange,
    validate,
    changed,
  }: Validate): Message {
    let validation: Message = {
      state: false,
      message: '',
    };
    if (!validate && !changed) {
      return validation;
    }
    if (
      typeof this.validations === 'object' &&
      (validChange || validate)
    ) {
      this.validations.forEach(obj => {
        let { rule = 'isEmpty' } = obj;
        const {
          message,
          ns = 'validations',
          props = { attribute: '' },
          args = [],
        } = obj;
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
          if (validator[rule as keyof ValidatorJS.ValidatorStatic]) {
            const validationMethod: any =
              validator[rule as keyof ValidatorJS.ValidatorStatic];
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
                validationMethod(value.toString(), args) === bolean
              ) {
                validation = {
                  state: true,
                  message,
                  ns,
                  props,
                };
              }
            } catch (error) {}
          }
        }
      });
    }
    return validation;
  }
}

export default InputValidator;
