import { useLocalObservable } from 'mobx-react';

import type {
  PropsField,
  NameField,
  FieldType,
  CommonValidations,
} from '../types';
import { FieldBuilder } from '../utils/builders/FieldBuilder';

export function useField<
  const V,
  const Name extends NameField,
  Validations extends CommonValidations | undefined = undefined,
>(
  props: () => PropsField<FieldType<Name, V, Validations>>,
): FieldBuilder<FieldType<Name, V, Validations>>;

export function useField<
  const V,
  const Name extends NameField,
  Validations extends CommonValidations | undefined = undefined,
>(
  props: PropsField<FieldType<Name, V, Validations>>,
): FieldBuilder<FieldType<Name, V, Validations>>;

export function useField<
  const V,
  const Name extends NameField,
  Validations extends CommonValidations | undefined = undefined,
>(
  props:
    | PropsField<FieldType<Name, V, Validations>>
    | (() => PropsField<FieldType<Name, V, Validations>>),
) {
  const field = useLocalObservable(() => {
    const fieldProps = typeof props === 'function' ? props() : props;
    return new FieldBuilder<FieldType<Name, V, Validations>>(
      fieldProps,
    );
  });
  return field;
}

export default useField;
