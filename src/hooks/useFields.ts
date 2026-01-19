import { useLocalObservable } from 'mobx-react';

import type { FieldBuilder } from '../utils/builders/FieldBuilder';
import type { FieldsBuilder } from '../utils/builders/FieldsBuilder';

export function useFields<Fields extends FieldBuilder<any>[]>(
  initializer: FieldsBuilder<Fields> | (() => FieldsBuilder<Fields>),
): FieldsBuilder<Fields> {
  const fields = useLocalObservable(() => {
    const result =
      typeof initializer === 'function' ? initializer() : initializer;
    return result;
  });
  return fields;
}

export default useFields;
