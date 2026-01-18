import type {
  PropsField,
  FieldType,
  NameField,
  CommonValidations,
} from '../types';
import { FieldBuilder } from './builders/FieldBuilder';

export function buildField<
  Value,
  const Name extends NameField,
  const Validations extends CommonValidations<any> | undefined,
>(
  field: PropsField<FieldType<Name, Value, Validations>>,
): FieldBuilder<PropsField<FieldType<Name, Value, Validations>>> {
  return new FieldBuilder(field as any) as any;
}

type A = FieldType<any, any, any>;

type B = PropsField<A>['validations'];
