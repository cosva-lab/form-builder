import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Inputs from './Inputs';
import type { OnChangeField, FieldProps, FieldType } from './types';
import { FieldBuilder } from './utils';

interface FieldRenderObserverProps<Field extends FieldType | PropsField<FieldType>> {
  component: React.ElementType<FieldProps<Field>>;
  propsForm: FieldProps<Field>;
}

const FieldRenderObserver = <Field extends FieldType | PropsField<FieldType>>({
  component,
  propsForm,
}: FieldRenderObserverProps<Field>) => {
  let FieldComponent = component;
  try {
    FieldComponent = observer(component);
  } catch (error) {}
  return <FieldComponent {...propsForm} />;
};

class FieldRender<
  Field extends FieldBuilder<FieldType>,
> extends React.PureComponent<FieldProps<Field>> {
  onChangeField: OnChangeField<Field> = (e, callback) => {
    const { onChangeField } = this.props;
    onChangeField?.(e, callback);
  };

  public render() {
    const { field, globalProps } = this.props;
    const { component: Component, render, type } = field;
    const propsForm: FieldProps<Field> = {
      field,
      onChangeField: this.onChangeField,
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
      if (React.isValidElement<FieldProps<Field>>(Component))
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
