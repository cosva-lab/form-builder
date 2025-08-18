import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Inputs from './Inputs';
import type {
  OnChangeField,
  value,
  NameField,
  FieldProps,
  LabelPropsField,
} from './types';

interface FieldRenderObserverProps<
  V = value,
  Name extends NameField = string,
  Label extends LabelPropsField = any,
> {
  component: React.ElementType<FieldProps<V, Name, Label>>;
  propsForm: FieldProps<V, Name, Label>;
}

const FieldRenderObserver = <
  V = value,
  Name extends NameField = string,
  Label extends LabelPropsField = any,
>({
  component,
  propsForm,
}: FieldRenderObserverProps<V, Name, Label>) => {
  let FieldComponent = component;
  try {
    FieldComponent = observer(component);
  } catch (error) {}
  return <FieldComponent {...propsForm} />;
};

class FieldRender<
  V = value,
  Name extends NameField = string,
  Label extends LabelPropsField = any,
> extends React.PureComponent<FieldProps<V, Name, Label>> {
  onChangeField: OnChangeField<V, Name, Label> = (e, callback) => {
    const { onChangeField } = this.props;
    onChangeField?.(e, callback);
  };

  public render() {
    const { field } = this.props;
    const { component: Component, render, type } = field;
    const propsForm: FieldProps<V, Name, Label> = {
      field,
      onChangeField: this.onChangeField,
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
      if (React.isValidElement<FieldProps<V, Name, Label>>(Component))
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
