import { Validation, AllPropsValidationFunction } from '../..';
import { ValidationFunction, PropsField, Step, Message } from '../..';

class InputValidator {
  public props: AllPropsValidationFunction;
  public get activeStep(): undefined | number { return this.props.activeStep }
  public get changed(): undefined | boolean { return this.props.changed }
  public get fields(): undefined | PropsField[] { return this.props.fields }
  public get steps(): undefined | Step[] { return this.props.steps }
  public get validChange(): undefined | boolean { return this.props.validChange }
  public get validate(): undefined | boolean { return this.props.validate }
  public get validations(): ((Validation | ValidationFunction)[]) { return this.props.validations || [] }
  public get value(): undefined | any { return this.props.value }

  constructor(props: AllPropsValidationFunction) {
    // validations is an array of validation rules specific to a form
    this.props = props;
    this.haveErrors = this.haveErrors.bind(this);
  }

  async haveErrors(p?: AllPropsValidationFunction): Promise<Message> {
    const value = (p && p.value) || this.value;
    const validChange = (p && p.validChange) || this.validChange;
    const validate = (p && p.validate) || this.validate;
    const changed = (p && p.changed) || this.changed;
    const fields = (p && p.fields) || this.fields;
    const steps = (p && p.steps) || this.steps;
    const activeStep = (p && p.activeStep) || this.activeStep;
    let messageResult: Message = {
      state: false,
      message: '',
    };
    if (!validate && !changed) {
      return messageResult;
    }

    if (
      typeof this.validations === 'object' &&
      (validChange || validate)
    ) {
      for (const validation of this.validations) {
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
          const temPError = await validation({
            fields,
            steps,
            activeStep,
            value,
            validChange,
            changed,
            validate,
          }) || {
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
