import React, { ReactNode } from 'react';
import FieldRender from './FieldRender';
import FieldBuilder from './utils/builders/FieldBuilder';
import {
  EventField,
  GetArrayValues,
  GetFields,
  GlobalPropsInterface,
  GridRender,
  InitialState,
  LabelPropsField,
  NameField,
  ValidationsFields,
  value,
} from './types';

export interface FieldsRenderProps<
  Name extends NameField,
  Item extends FieldBuilder<value, Name, LabelPropsField>,
  Fields extends Item[],
  FieldsObject,
> extends InitialState,
    GlobalPropsInterface,
    ValidationsFields<Name, Item, Fields, FieldsObject>,
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

export class FieldsRender<
  Name extends NameField,
  Item extends FieldBuilder<value, Name, LabelPropsField>,
  Fields extends Item[],
  FieldsObject,
> extends React.PureComponent<
  FieldsRenderProps<Name, Item, Fields, FieldsObject>
> {
  public static defaultProps = {
    ns: 'inputs',
    transPosition: '',
  };

  /**
   *
   *
   * @return {JSX.Element}
   * @memberof FieldsRender
   */
  public render() {
    const { fields, globalProps, grid, onChangeField } = this.props;
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
  }
}

export default FieldsRender;
