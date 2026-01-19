import type {
  PropsField,
  FieldType,
  Simplify,
  CommonValidations,
} from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export function buildField<
  V,
  Validations extends CommonValidations<V> | undefined,
  const P extends PropsField<FieldType<any, V, Validations, any>>,
>(
  field: P & { value: V; validations?: Validations },
): FieldBuilder<
  Simplify<
    FieldType<
      P['name'],
      V,
      Validations,
      P['label']
    >
  >
> {
  return new FieldBuilder(field as any) as any;
}
