import { useLocalObservable } from 'mobx-react';

import type {
  PropsField,
  FieldType,
  Simplify,
  CommonValidations,
  NameField,
} from '../types';
import { FieldBuilder } from '../utils/builders/FieldBuilder';

export function useField<
  V,
  const N extends NameField,
  Validations extends CommonValidations<V> | undefined,
  L,
>(
  props:
    | PropsField<FieldType<N, V, Validations, L>>
    | (() => PropsField<FieldType<N, V, Validations, L>>),
): FieldBuilder<Simplify<FieldType<N, V, Validations, L>>> {
  const field = useLocalObservable(() => {
    const fieldProps =
      typeof props === 'function' ? props() : (props as any);
    return new FieldBuilder(fieldProps as any);
  });

  return field as any;
}

export default useField;
