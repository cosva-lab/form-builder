import { useLocalObservable } from 'mobx-react';

import { FieldBuilder, FieldsBuilder } from '../utils/builders';

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
