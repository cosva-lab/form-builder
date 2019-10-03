import React from 'react';
import * as ReactIs from 'react-is';
import { Observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Inputs from './Inputs';
import {
  FieldRenderComponetsProps,
  changeField,
  ChangeField,
} from './';
import { Message } from './types';

export class FieldRender
  extends React.PureComponent<FieldRenderComponetsProps>
  implements ChangeField {
  static defaultProps = {
    ns: 'inputs',
    transPosition: false,
    sm: 12,
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
    const { sm } = props;
    const { md = sm } = props;
    const { lg = md } = props;
    const { xs = lg } = props;
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
              React.createElement<FieldRenderComponetsProps>(
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
      <Grid item sm={sm} md={md} lg={lg} xs={xs}>
        {formInput}
      </Grid>
    );
  }
}
