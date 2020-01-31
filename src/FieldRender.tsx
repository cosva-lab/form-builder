import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import { FieldProps, changeField, ChangeField } from './';
import { BreakpointsField, value } from './types';

@observer
class FieldRenderObserver extends React.Component<{
  FieldComponent: React.ElementType<FieldProps<any>>;
  propsForm: FieldProps<any>;
}> {
  render() {
    const { FieldComponent, propsForm } = this.props;
    return <FieldComponent {...propsForm} />;
  }
}

class FieldRender<V = value>
  extends React.PureComponent<FieldProps<V>>
  implements ChangeField {
  changeField: changeField = async ({ target }, callback) => {
    this.props.changeField({ target }, callback);
  };

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
            FieldComponent={component}
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
