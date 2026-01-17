import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Inputs from './Inputs';
import type {
  EventField,
  FieldProps,
  FieldType,
  GlobalProps,
  PropsField,
} from './types';
import type { FieldBuilder } from './utils/builders/FieldBuilder';

interface FieldRenderObserverProps<Field extends PropsField> {
  component: React.ElementType<FieldProps<Field>>;
  propsForm: FieldProps<Field>;
}

const FieldRenderObserver = <Field extends PropsField>({
  component,
  propsForm,
}: FieldRenderObserverProps<Field>) => {
  let FieldComponent = component;
  try {
    FieldComponent = observer(component);
  } catch (error) {}
  return <FieldComponent {...propsForm} />;
};

export interface FieldRenderProps<
  Field extends FieldBuilder<FieldType>,
> {
  field: Field;
  onChangeField?(
    event: EventField<Field['value'], Field['name']>,
    nativeEvent?: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void | (() => void);
  globalProps?: GlobalProps;
}

class FieldRender<
  Field extends FieldBuilder<any>,
> extends React.PureComponent<FieldRenderProps<Field>> {
  public render() {
    const { field, globalProps } = this.props;
    const { component: Component, render, type } = field;
    const propsForm: FieldRenderProps<Field> = {
      field,
      globalProps,
    };
    const formInput = <Inputs {...propsForm} />;
    if (render)
      return render({
        children: formInput,
        props: propsForm,
      });

    if (type === 'component') {
      if (Component)
        Component.displayName = `[fields.${field.name.toString()}].component`;
      if (React.isValidElement<FieldRenderProps<Field>>(Component))
        return (
          <Component.type {...{ ...Component.props, ...propsForm }} />
        );

      if (ReactIs.isValidElementType(Component))
        return (
          <FieldRenderObserver
            component={Component}
            propsForm={propsForm}
          />
        );
      return null;
    }
    return formInput;
  }
}

export default FieldRender;
