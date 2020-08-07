import { useLocalStore } from 'mobx-react';

import { FieldsProps } from '../types';
import { FieldsBuilder } from '../utils';

export const useFields = (
  props: FieldsProps | (() => FieldsProps),
) => {
  const fields = useLocalStore(() => {
    const fieldsProps = typeof props === 'function' ? props() : props;
    return new FieldsBuilder(fieldsProps);
  });
  return fields;
};
export default useFields;
