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
    this.props.changeField(event, callback);
  };

  /**
   *
   *
   * @return {JSX.Element}
   * @memberof FieldsRender
   */
  public render() {
    const {
      validate,
      ns,
      transPosition,
      getSteps,
      isNew,
      fields,
      globalProps,
    } = this.props;
    return (
      <>
        {fields.map(field => {
          const {
            label = {
              message: field.name,
              ns,
              notPos: !!transPosition,
            },
          } = field;
          return (
            <FieldRender
              key={field.name}
              fieldProxy={
                (field instanceof FieldBuilder && field) || undefined
              }
              {...{
                ...field,
                ns: field.ns || ns,
                globalProps,
                transPosition,
                label,
                validate,
                getSteps,
                isNew,
                changeField: this.changeField,
                getFields: () => this.props.fields,
              }}
            />
          );
        })}
      </>
    );
  }
}

export default FieldsRender;
