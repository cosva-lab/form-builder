import { useLocalObservable } from 'mobx-react';

import type { value, PropsField, NameField } from '../types';
import { FieldBuilder } from '../utils/builders';

export function useField<V = value, Name extends NameField = string>(
  props: PropsField<V, Name> | (() => PropsField<V, Name>),
) {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder<V, Name>(fieldProps);
  });
  return field;
}
export default useField;
