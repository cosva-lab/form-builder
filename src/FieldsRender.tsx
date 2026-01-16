import React, { ReactNode } from 'react';
import FieldRender from './FieldRender';
import FieldBuilder from './utils/builders/FieldBuilder';
import {
  EventField,
  GetArrayValues,
  GetFields,
  GlobalProps,
  FieldType,
} from './types';
import { Reducer } from './utils/types';

export interface FieldsRenderProps<
  Field extends PropsField,
  Fields extends FieldBuilder<Field>[],
  FieldsObject = Reducer<Fields>,
> {
  onChangeField?<Field extends keyof FieldsObject>(
    event: EventField<FieldsObject[Field], Field>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);

  children?: ReactNode;
  fields: GetArrayValues<GetFields<FieldsObject>>;
  globalProps?: GlobalProps;
}

export const FieldsRender = <
  Field extends PropsField,
  Item extends FieldBuilder<Field>,
  Fields extends Item[],
>(
  props: FieldsRenderProps<Field, Fields>,
) => {
  const { fields, globalProps, onChangeField } = props;
  return (
    <>
      {fields.map((field) => (
        <FieldRender<FieldBuilder<FieldType>>
          key={`${field.name}`}
          field={field as any}
          onChangeField={onChangeField}
          globalProps={globalProps}
        />
      ))}
    </>
  );
};

export default FieldsRender;
