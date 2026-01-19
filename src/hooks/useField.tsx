import { useLocalObservable } from 'mobx-react';

import type {
  PropsField,
  FieldType,
  Simplify,
  CommonValidations,
} from '../types';
import { FieldBuilder } from '../utils/builders/FieldBuilder';

export function useField<
  V,
  Validations extends CommonValidations<V> | undefined,
  const P extends PropsField<FieldType<any, V, Validations, any>>,
>(
  props:
    | (P & { value: V; validations?: Validations })
    | (() => P & { value: V; validations?: Validations }),
): FieldBuilder<
  Simplify<FieldType<P['name'], V, Validations, P['label']>>
> {
  const field = useLocalObservable(() => {
    const fieldProps =
      typeof props === 'function' ? props() : (props as any);
    return new FieldBuilder(fieldProps as any);
  });

  return field as any;
}

export default useField;
