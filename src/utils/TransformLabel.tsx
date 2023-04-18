import React from 'react';
import { PropsField } from '../types';
import { GlobalTranslate } from '../contexts/GlobalTranslate';

export const TransformLabel = <
  V = any,
  Name extends PropertyKey = string,
>({
  ns,
  name,
  label,
}: Pick<PropsField<V, Name>, 'ns' | 'name' | 'label'>) => {
  if (React.isValidElement<any>(label)) return label;
  let message: string;
  let props;
  const nsLabel = ns;
  if (typeof label === 'string') message = label;
  else {
    if (label) message = label.message || name.toString();
    else message = name.toString();
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
