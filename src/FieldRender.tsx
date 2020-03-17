import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import { FieldProps, changeField, ChangeField } from './';
import { BreakpointsField, value } from './types';

interface FieldRenderObserverProps {
  component: React.ElementType<FieldProps<any>>;
  propsForm: FieldProps<any>;
}

const FieldRenderObserver = ({
  component,
  propsForm,
}: FieldRenderObserverProps) => {
  const FieldComponent = observer(component);
  return <FieldComponent {...propsForm} />;
};

class FieldRender<V = value>
  extends React.PureComponent<FieldProps<V>>
  implements ChangeField {
  changeField: changeField = (e, callback) =>
    this.props.changeField(e, callback);

  public render() {
    const { fieldProxy } = this.props;
    const breakpoints: BreakpointsField = {
      ...fieldProxy.breakpoints,
    };
    const { xs = 12 } = breakpoints;
    const { sm = xs } = breakpoints;
    const { md = sm } = breakpoints;
    const { lg = md } = breakpoints;
    const { xl = lg } = breakpoints;
    const { component, render, type } = fieldProxy;
    const propsForm: FieldProps<V> = {
      fieldProxy,
      changeField: this.changeField,
    };
    const formInput = <Inputs {...propsForm} />;
    if (render)
      return render({
        children: formInput,
        props: propsForm,
      });

    if (type === 'component') {
      if (
        React.isValidElement<FieldProps<V>>(component) &&
        typeof component !== 'function'
      ) {
        return (
          <component.type {...{ ...component.props, ...propsForm }} />
        );
      }
      if (ReactIs.isValidElementType(component))
        return (
          <FieldRenderObserver
            component={component}
            propsForm={propsForm}
          />
        );
      return null;
    }
    return (
      <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
        {formInput}
      </Grid>
    );
  }
}
export { FieldRender };
export default FieldRender;
