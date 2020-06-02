import { useLocalStore } from 'mobx-react';

import { FieldsProps } from '../types';
import { FieldsBuilder } from '../utils';

export const useFields = (props: FieldsProps) => {
  const field = useLocalStore(() => new FieldsBuilder(props));
  return field;
};
export default useFields;
