import React from 'react';
import { FieldRender } from './FieldRender';
import { changeField } from './';
import { FieldsRenderProps } from './types';
import FieldBuilder from './utils/builders/FieldBuilder';

export class FieldsRender extends React.PureComponent<
  FieldsRenderProps
> {
  public static defaultProps = {
    ns: 'inputs',
    transPosition: '',
  };

  changeField: changeField = (event, callback) => {
    const { changeField } = this.props;
    changeField && changeField(event, callback);
  };

  /**
   *
   *
   * @return {JSX.Element}
   * @memberof FieldsRender
   */
  public render() {
    const { getSteps, fields, globalProps, grid } = this.props;
    return (
      <>
        {fields.map(field => {
          if (field instanceof FieldBuilder && globalProps)
            field.globalProps = globalProps;
          return (
            <FieldRender
              key={field.name}
              field={
                (field instanceof FieldBuilder && field) ||
                new FieldBuilder(field)
              }
              {...{
                getSteps,
                changeField: this.changeField,
                getFields: () => this.props.fields,
                grid,
              }}
            />
          );
        })}
      </>
    );
  }
}

export default FieldsRender;
