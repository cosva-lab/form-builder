import { useLocalObservable } from 'mobx-react';

import type { PropsField, FieldType, Simplify } from '../types';
import { FieldBuilder } from '../utils/builders/FieldBuilder';

export function useField<
  const P extends PropsField<FieldType<any, any, any>>,
>(
  props: P | (() => P),
): FieldBuilder<
  Simplify<
    FieldType<
      P['name'],
      P['value'],
      P extends { validations: infer V } ? V : undefined
    >
  >
> {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder(fieldProps as any);
  });

  return field as any;
}

export default useField;
