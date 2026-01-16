import { useLocalObservable } from 'mobx-react';

import type { FieldType, FieldsToObject, GetFields } from '../types';
import { FieldsBuilder } from '../utils/builders';

type Union<Fields extends readonly FieldType[]> = FieldsBuilder<
  Fields,
  GetFields<FieldsToObject<Fields>>
>;

export function useFields<Fields extends readonly FieldType[]>(
  initializer: Union<Fields> | (() => Union<Fields>),
): FieldsBuilder<Fields, GetFields<FieldsToObject<Fields>>> {
  const fields = useLocalObservable(() => {
    const result =
      typeof initializer === 'function' ? initializer() : initializer;
    return result;
  });
  return fields;
}

export default useFields;
