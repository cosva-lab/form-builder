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
  Name extends NameField,
  Value,
  Validations extends CommonValidations<Value> | undefined,
  Label,
>(
  props: PropsField<FieldType<Name, Value, Validations, Label>>,
): FieldBuilder<Simplify<FieldType<Name, Value, Validations, Label>>>;
export function useField<
  Name extends NameField,
  Value,
  Validations extends CommonValidations<Value> | undefined,
  Label,
>(
  props: () => PropsField<FieldType<Name, Value, Validations, Label>>,
): FieldBuilder<Simplify<FieldType<Name, Value, Validations, Label>>>;
export function useField(props: any): any {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder(fieldProps as any);
  });

  return field as any;
}

export default useField;
