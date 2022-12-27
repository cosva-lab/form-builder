import React from 'react';
import isEmpty from 'lodash/isEmpty';

import { Animation } from '../FieldTranslate';
import type { ValidationErrors } from '../types';

export const AnimateHelperText: React.FC<{
  errors?: ValidationErrors;
  animation?: boolean;
  children?: React.ReactNode;
}> = ({ children, errors, animation }) => {
  const child = children;
  if (animation && !isEmpty(errors)) {
    animation = false;
    return <Animation>{child}</Animation>;
  }
  return <>{child || null}</>;
};
