import { useLocalObservable } from 'mobx-react';

import type { FieldsProps } from '../types';
import { FieldsBuilder } from '../utils';

export const useFields = (
  props: FieldsProps | (() => FieldsProps),
) => {
  const fields = useLocalObservable(() => {
    const fieldsProps = typeof props === 'function' ? props() : props;
    return new FieldsBuilder(fieldsProps);
  });
  return fields;
};
export default useFields;
