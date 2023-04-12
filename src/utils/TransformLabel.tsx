import React from 'react';
import { PropsField } from '../types';
import { GlobalTranslate } from '../contexts/GlobalTranslate';

export const TransformLabel = ({
  ns,
  name,
  label,
}: Pick<PropsField, 'ns' | 'name' | 'label'>) => {
  if (React.isValidElement<any>(label)) return label;
  let message;
  let props;
  const nsLabel = ns;
  if (typeof label === 'string') message = label;
  else {
    if (label) message = label.message || name;
    else message = name;
  }
  return (
    <GlobalTranslate
      {...{
        message,
        ns: nsLabel,
        props,
      }}
    />
  );
};
