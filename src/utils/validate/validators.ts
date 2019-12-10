import contains from 'validator/lib/contains';
import equals from 'validator/lib/equals';
import isAfter from 'validator/lib/isAfter';
import isAlpha from 'validator/lib/isAlpha';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import isAscii from 'validator/lib/isAscii';
import isDecimal from 'validator/lib/isDecimal';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isFloat from 'validator/lib/isFloat';
import isNumeric from 'validator/lib/isNumeric';

const validators = {
  contains,
  equals,
  isAfter,
  isAlpha,
  isAlphanumeric,
  isAscii,
  isDecimal,
  isEmail,
  isEmpty,
  isFloat,
  isNumeric,
};

export default validators;
