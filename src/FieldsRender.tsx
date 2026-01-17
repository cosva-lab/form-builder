import React, { ReactNode } from 'react';
import FieldRender from './FieldRender';
import FieldBuilder from './utils/builders/FieldBuilder';
import {
  EventField,
  GlobalProps,
  FieldType,
  PropsField,
  FieldsToObject,
  GetFieldsValue,
} from './types';

export interface FieldsRenderProps<
  Fields extends FieldBuilder<any>[],
> {
  onChangeField<FieldName extends keyof GetFieldsValue<Fields>>(
    event: EventField<GetFieldsValue<Fields>[FieldName], FieldName>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void;

  children?: ReactNode;
  fields: Fields;
  globalProps?: GlobalProps;
}

export const FieldsRender = <Fields extends FieldBuilder<any>[]>(
  props: FieldsRenderProps<Fields>,
) => {
  const { fields, globalProps } = props;
  return (
    <>
      {fields.map((field) => (
        <FieldRender<FieldBuilder<FieldType>>
          key={field.name.toString()}
          field={field as any}
          globalProps={globalProps}
        />
      ))}
    </>
  );
};

export default FieldsRender;
