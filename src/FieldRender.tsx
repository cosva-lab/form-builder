import React from 'react';
import * as ReactIs from 'react-is';
import { Observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import {
  FieldRenderComponentProps,
  changeField,
  ChangeField,
} from './';
import { Message, BreakpointsField } from './types';

export class FieldRender
  extends React.PureComponent<FieldRenderComponentProps>
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
    const breakpoints: BreakpointsField = { ...props.breakpoints };
    const { xs = 12 } = breakpoints;
    const { sm = xs } = breakpoints;
    const { md = sm } = breakpoints;
    const { lg = md } = breakpoints;
    const { xl = lg } = breakpoints;
    const {
      state = true,
      render,
      type,
      component: Component,
      fieldProxy,
    } = props;
    const propsForm = {
      ...props,
      changeField: this.changeField,
      component: Component,
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
      if (React.isValidElement(Component)) {
        return (
          <Component.type {...{ ...Component.props, ...propsForm }} />
        );
      }
      if (ReactIs.isValidElementType(Component)) {
        return (
          <Observer>
            {() =>
              React.createElement<FieldRenderComponentProps>(
                Component as any,
                {
                  ...propsForm,
                  ...fieldProxy,
                },
              )
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
