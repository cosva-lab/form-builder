import React, { ReactNode } from 'react';
import FieldRender from './FieldRender';
import FieldBuilder from './utils/builders/FieldBuilder';
import {
  EventField,
  GlobalProps,
  FieldType,
  PropsField,
  FieldsToObject,
} from './types';

export interface FieldsRenderProps<
  Fields extends FieldBuilder<any>[],
  FieldsObject extends FieldsToObject<Fields>,
> {
  onChangeField?<Field extends keyof FieldsObject>(
    event: EventField<FieldsObject[Field], Field>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);

  children?: ReactNode;
  fields: Fields;
  globalProps?: GlobalProps;
}

export const FieldsRender = <Fields extends FieldBuilder<any>[]>(
  props: FieldsRenderProps<Fields, FieldsToObject<Fields>>,
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
