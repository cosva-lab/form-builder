import { useLocalObservable } from 'mobx-react';

import type {
  PropsField,
  NameField,
  LabelPropsField,
} from '../types';
import { FieldBuilder } from '../utils/builders';

export function useField<
  V,
  Name extends NameField = NameField,
  Label extends LabelPropsField = undefined,
>(
  props:
    | PropsField<V, Name, Label>
    | (() => PropsField<V, Name, Label>),
): FieldBuilder<V, Name, Label>;
export function useField<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
>(
  props:
    | PropsField<V, Name, Label>
    | (() => PropsField<V, Name, Label>),
) {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder<V, Name, Label>(fieldProps);
  });
  return field;
}
export default useField;
