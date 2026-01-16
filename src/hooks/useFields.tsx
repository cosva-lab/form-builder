import { useLocalObservable } from 'mobx-react';

import type { PropsField, FieldType } from '../types';
import { FieldsBuilder } from '../utils/builders';
import { Reducer } from '../utils/types';

type Union<
  Field extends FieldType | PropsField<FieldType>,
  Item extends PropsField<Field>,
  Fields extends Item[],
  FieldsObject extends Reducer<Fields>,
> = FieldsBuilder<Field, Item, Fields, FieldsObject>;

export function useFields<
  Field extends FieldType | PropsField<FieldType>,
  Item extends PropsField<Field>,
  Fields extends Item[],
  FieldsObject extends Reducer<Fields>,
>(
  initializer:
    | Union<Field, Item, Fields, FieldsObject>
    | (() => Union<Field, Item, Fields, FieldsObject>),
): FieldsBuilder<Field, Item, Fields, FieldsObject> {
  const fields = useLocalObservable(() => {
    const result =
      typeof initializer === 'function' ? initializer() : initializer;
    return result;
  });
  return fields;
}

export default useFields;
