import React from 'react';
import { PropsField } from '..';
import { getMessage } from '../FieldTranslate';

export const TransformLabel = ({
  ns,
  name,
  label,
}: Pick<PropsField, 'ns' | 'name' | 'label'>) => {
  if (React.isValidElement(label)) return label;
  let message;
  let props;
  const nsLabel = ns;
  if (typeof label === 'string') {
    message = label;
  } else {
    if (label) {
      message = label.message || name;
    } else {
      message = name;
    }
  }
  return getMessage({
    message,
    ns: nsLabel,
    props,
  });
};
