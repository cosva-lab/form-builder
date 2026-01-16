import { useLocalObservable } from 'mobx-react';

import type { PropsField, FieldType } from '../types';
import { FieldBuilder } from '../utils/builders';

export function useField<Field extends FieldType | PropsField<FieldType>>(
  props: PropsField<Field> | (() => PropsField<Field>),
) {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder<Field>(
      fieldProps as Field & PropsField<Field>,
    );
  });
  return field;
}
export default useField;
