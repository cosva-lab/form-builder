import React, { ReactNode } from 'react';
import FieldRender from './FieldRender';
import FieldBuilder from './utils/builders/FieldBuilder';
import {
  EventField,
  GetArrayValues,
  GetFields,
  GlobalPropsInterface,
  GridRender,
  LabelPropsField,
  NameField,
  value,
} from './types';

export interface FieldsRenderProps<
  Name extends NameField,
  Item extends FieldBuilder<value, Name, LabelPropsField>,
  Fields extends Item[],
  FieldsObject,
> extends GlobalPropsInterface,
    GridRender {
  onChangeField?<Field extends keyof FieldsObject>(
    event: EventField<FieldsObject[Field], Field>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);

  children?: ReactNode;
  fields: GetArrayValues<GetFields<FieldsObject>>;
}

export const FieldsRender = <
  Name extends NameField,
  Item extends FieldBuilder<value, Name, LabelPropsField>,
  Fields extends Item[],
  FieldsObject,
>(
  props: FieldsRenderProps<Name, Item, Fields, FieldsObject>,
) => {
  const { fields, globalProps, grid, onChangeField } = props;
  return (
    <>
      {fields.map((field) => {
        if (field instanceof FieldBuilder && globalProps)
          field.globalProps = globalProps;
        return (
          <FieldRender<any, any>
            key={field.name.toString()}
            field={field}
            onChangeField={onChangeField}
            {...{
              grid,
            }}
          />
        );
      })}
    </>
  );
};

export default FieldsRender;
