import React from 'react';
import * as ReactIs from 'react-is';
import { Observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import {
  FieldRenderProps,
  FieldRenderObserveProps,
  changeField,
  ChangeField,
} from '.';
import { Message, BreakpointsField, value } from './types';

class FieldRenderObserve<V = value>
  extends React.PureComponent<FieldRenderObserveProps<V>>
  implements ChangeField {
  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    search: {
      state: false,
    },
  };

  public errorFlag: Message | undefined;

  changeField: changeField = async ({ target }, callback) => {
    this.props.changeField({ target }, callback);
  };

  public render() {
    const { props } = this;
    const { fieldProxy } = props;
    const breakpoints: BreakpointsField = {
      ...fieldProxy.breakpoints,
    };
    const { xs = 12 } = breakpoints;
    const { sm = xs } = breakpoints;
    const { md = sm } = breakpoints;
    const { lg = md } = breakpoints;
    const { xl = lg } = breakpoints;
    const { render, type, component } = fieldProxy;
    let { state = fieldProxy.state } = { ...fieldProxy };
    if (typeof state === 'undefined') state = true;
    const propsForm: FieldRenderProps<V> = {
      ...props,
      ...fieldProxy,
      fieldProxy,
      changeField: this.changeField,
      component,
    };
    if (!state) return null;
    const formInput = <Inputs {...propsForm} />;
    if (render) {
      return render({
        children: formInput,
        props: propsForm,
      });
    }
    if (type === 'component') {
      if (
        React.isValidElement<FieldRenderProps<V>>(component) &&
        typeof component !== 'function'
      ) {
        return (
          <component.type {...{ ...component.props, ...propsForm }} />
        );
      }
      if (ReactIs.isValidElementType(component)) {
        return (
          <Observer>
            {() =>
              React.createElement<FieldRenderProps<V>>(component, {
                ...propsForm,
                ...fieldProxy,
              })
            }
          </Observer>
        );
      }
      return null;
    }
    return (
      <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
        {formInput}
      </Grid>
    );
  }
}
export { FieldRenderObserve };
export default FieldRenderObserve;
