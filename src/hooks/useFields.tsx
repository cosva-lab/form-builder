import { useLocalObservable } from 'mobx-react';

import type {
  FieldsProps,
  NameField,
  PropsField,
  value,
} from '../types';
import { FieldsBuilder } from '../utils/builders';
import { Reducer } from '../utils/types';

type Union<
  Name extends NameField,
  Value extends value,
  Item extends PropsField<Value, Name>,
  Fields extends Item[],
  FieldsObject extends Reducer<Fields>,
> = FieldsBuilder<Name, Item, Fields, FieldsObject>;

export function useFields<
  Name extends NameField,
  Value extends value,
  Item extends PropsField<Value, Name>,
  Fields extends Item[],
  FieldsObject extends Reducer<Fields>,
>(
  initializer:
    | Union<Name, Value, Item, Fields, FieldsObject>
    | (() => Union<Name, Value, Item, Fields, FieldsObject>),
): FieldsBuilder<Name, Item, Fields, FieldsObject> {
  const fields = useLocalObservable(() => {
    const result =
      typeof initializer === 'function' ? initializer() : initializer;
    return result;
  });
  return fields;
}

export default useFields;
