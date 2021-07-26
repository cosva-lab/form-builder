import { useLocalObservable } from 'mobx-react';

import { value, PropsField } from '../types';
import { FieldBuilder } from '../utils';

export const useField = <V extends value>(
  props: PropsField<V> | (() => PropsField<V>),
) => {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder(fieldProps);
  });
  return field;
};
export default useField;
