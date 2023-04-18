import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Inputs from './Inputs';
import type {
  OnChangeField,
  BreakpointsField,
  value,
  NameField,
  FieldProps,
} from './types';

interface FieldRenderObserverProps<
  V = value,
  Name extends NameField = string,
> {
  component: React.ElementType<FieldProps<V, Name>>;
  propsForm: FieldProps<V, Name>;
}

const FieldRenderObserver = <
  V = value,
  Name extends NameField = string,
>({
  component,
  propsForm,
}: FieldRenderObserverProps<V, Name>) => {
  let FieldComponent = component;
  try {
    FieldComponent = observer(component);
  } catch (error) {}
  return <FieldComponent {...propsForm} />;
};

class FieldRender<
  V = value,
  Name extends NameField = string,
> extends React.PureComponent<FieldProps<V, Name>> {
  onChangeField: OnChangeField<V, Name> = (e, callback) => {
    const { onChangeField } = this.props;
    onChangeField?.(e, callback);
  };

  public render() {
    const { field } = this.props;
    const breakpoints: BreakpointsField = {
      ...field.breakpoints,
    };
    const { xs = 12 } = breakpoints;
    const { sm = xs } = breakpoints;
    const { md = sm } = breakpoints;
    const { lg = md } = breakpoints;
    const { xl = lg } = breakpoints;
    const {
      component: Component,
      render,
      type,
      grid = typeof this.props.grid !== 'undefined'
        ? this.props.grid
        : true,
    } = field;
    const propsForm: FieldProps<V, Name> = {
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
      if (React.isValidElement<FieldProps<V, Name>>(Component))
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
    return grid ? (
      <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
        {formInput}
      </Grid>
    ) : (
      formInput
    );
  }
}

export default FieldRender;
