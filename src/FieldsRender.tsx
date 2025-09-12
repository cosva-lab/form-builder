import React, { ReactNode } from 'react';
import FieldRender from './FieldRender';
import FieldBuilder from './utils/builders/FieldBuilder';
import {
  EventField,
  GetArrayValues,
  GetFields,
  GlobalProps,
  LabelPropsField,
  NameField,
  value,
} from './types';
import { Reducer } from './utils/types';

export interface FieldsRenderProps<
  Name extends NameField,
  Item extends FieldBuilder<value, Name, LabelPropsField>,
  Fields extends Item[],
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
  Name extends NameField,
  Item extends FieldBuilder<value, Name, LabelPropsField>,
  Fields extends Item[],
  FieldsObject,
>(
  props: FieldsRenderProps<Name, Item, Fields, FieldsObject>,
) => {
  const { fields, globalProps, onChangeField } = props;
  return (
    <>
      {fields.map((field) => (
        <FieldRender<any, any>
          key={field.name.toString()}
          field={field}
          onChangeField={onChangeField}
          globalProps={globalProps}
        />
      ))}
    </>
  );
};

export default FieldsRender;
