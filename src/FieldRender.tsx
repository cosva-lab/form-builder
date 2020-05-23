import React from 'react';
import * as ReactIs from 'react-is';
import { Observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import { FieldProps, changeField, ChangeField } from './';
import { BreakpointsField, value } from './types';

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
    const {
      component: Component,
      render,
      type,
      grid = true,
    } = fieldProxy;
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
        React.isValidElement<FieldProps<V>>(Component) &&
        typeof Component !== 'function'
      ) {
        return (
          <Component.type {...{ ...Component.props, ...propsForm }} />
        );
      }
      if (ReactIs.isValidElementType(Component))
        return (
          <Observer>{() => <Component {...propsForm} />}</Observer>
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
export { FieldRender };
export default FieldRender;
