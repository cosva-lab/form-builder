import { PropsField } from '..';

export const transformLabel = ({
  ns,
  name,
  label,
}: {
  ns?: string;
  name: string;
  label: PropsField['label'];
}) => {
  let message,
    props,
    nsLabel = ns,
    transPosition: string = '';
  if (typeof label === 'string') {
    message = label;
  } else {
    if (label) {
      message = label!.message || name;
      if (typeof label!.transPosition === 'string') {
        transPosition = label!.transPosition || '';
      }
    } else {
      message = name;
    }
  }
  if (transPosition !== '') transPosition += '.';
  return {
    message: `${transPosition}${message}`,
    ns: nsLabel,
    props,
  };
};