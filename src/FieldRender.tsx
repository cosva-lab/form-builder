import React from 'react';
import * as ReactIs from 'react-is';
import { Observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import { FieldRenderProps, changeField, ChangeField } from './';
import { Message, BreakpointsField, value } from './types';
import { observe, Lambda } from 'mobx';

class FieldRender<V = value>
  extends React.PureComponent<FieldRenderProps<V>>
  implements ChangeField {
  public subscription?: Lambda;
  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    search: {
      state: false,
    },
  };

  componentDidMount() {
    if (this.props.fieldProxy) {
      this.subscription = observe(
        this.props.fieldProxy,
        'status',
        () => {
          this.forceUpdate();
        },
      );
    }
  }

  componentWillUnmount() {
    this.subscription && this.subscription();
  }

  public errorFlag: Message | undefined;

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
    const propsForm: FieldRenderProps<V> = {
      fieldProxy,
      changeField: this.changeField,
    };
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
export { FieldRender };
export default FieldRender;
