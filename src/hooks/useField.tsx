import { useLocalObservable } from 'mobx-react';

import type {
  PropsField,
  FieldType,
  Simplify,
  CommonValidations,
  NameField,
} from '../types';
import { FieldBuilder } from '../utils/builders/FieldBuilder';

export function useField<
  Value,
  const Name extends NameField,
  const Validations extends CommonValidations<any> | undefined,
>(
  initializer: () => PropsField<FieldType<Name, Value, Validations>>,
): FieldBuilder<
  PropsField<Simplify<FieldType<Name, Value, Validations>>>
>;

export function useField<
  Value,
  const Name extends NameField,
  const Validations extends CommonValidations<any> | undefined,
>(
  props: PropsField<FieldType<Name, Value, Validations>>,
): FieldBuilder<
  PropsField<Simplify<FieldType<Name, Value, Validations>>>
>;

export function useField<
  Value,
  const Name extends NameField,
  const Validations extends CommonValidations<any> | undefined,
>(
  props:
    | PropsField<FieldType<Name, Value, Validations>>
    | (() => PropsField<FieldType<Name, Value, Validations>>),
): FieldBuilder<
  PropsField<Simplify<FieldType<Name, Value, Validations>>>
> {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder(fieldProps as any);
  });

  return field as any;
}

export default useField;
