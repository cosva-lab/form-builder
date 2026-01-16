import { NameField } from '../types';

type Callback<Item> = Item extends {
  name: infer Name;
  value: infer Value;
}
  ? Name extends NameField
    ? Record<Name, Value>
    : never
  : never;
export type Reducer<T, Acc = {}> = T extends []
  ? Acc
  : T extends [infer Head, ...infer Tail]
  ? Reducer<Tail, Acc & Callback<Head>>
  : never;
