import { useLocalStore } from 'mobx-react';

import { value, PropsField } from '../types';
import { FieldBuilder } from '../utils';

export const useField = <V extends value>(props: PropsField<V>) => {
  const field = useLocalStore(() => new FieldBuilder(props));
  return field;
};
export default useField;
