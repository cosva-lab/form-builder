import React from 'react';
import * as ReactIs from 'react-is';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
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
  let FieldComponent = component;
  try {
    FieldComponent = observer(component);
  } catch (error) {}
  return <FieldComponent {...propsForm} />;
};

class FieldRender<V = value>
  extends React.PureComponent<FieldProps<V>>
  implements ChangeField {
  changeField: changeField = (e, callback) => {
    const { changeField } = this.props;
    changeField && changeField(e, callback);
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
    const propsForm: FieldProps<V> = {
      field,
      changeField: this.changeField,
    };
    const formInput = <Inputs {...propsForm} />;
    if (render)
      return render({
        children: formInput,
        props: propsForm,
      });

    if (type === 'component') {
      if (React.isValidElement<FieldProps<V>>(Component)) {
        return (
          <Component.type {...{ ...Component.props, ...propsForm }} />
        );
      }
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
export { FieldRender };
export default FieldRender;
