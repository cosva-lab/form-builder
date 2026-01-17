import { useLocalObservable } from 'mobx-react';

import type {
  PropsField,
  FieldType,
  Simplify,
  NameField,
  CommonValidations,
} from '../types';
import { FieldBuilder } from '../utils/builders/FieldBuilder';

export function useField<
  Value,
  Name extends NameField,
  Validations extends
    | CommonValidations<FieldType<Name, Value, any>>
    | undefined,
>(
  props:
    | PropsField<FieldType<Name, Value, Validations>>
    | (() => PropsField<FieldType<Name, Value, Validations>>),
): FieldBuilder<Simplify<FieldType<Name, Value, Validations>>> {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder(fieldProps as any);
  });

  return field as any;
}

export default useField;
