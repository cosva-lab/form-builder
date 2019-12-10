import React from 'react';
import { FieldRender } from './FieldRender';
import { changeField } from './';
import { FieldsRenderProps, BaseBuilder } from './types';

declare type Props = FieldsRenderProps & BaseBuilder;

export class FieldsRender extends React.PureComponent<Props> {
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
      actionsExtra,
      ns,
      transPosition,
      getSteps,
      isNew,
      fields,
      extra,
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
              fieldProxy={field}
              {...{
                ...field,
                ns: field.ns || ns,
                extra,
                transPosition,
                label,
                validate,
                actionsExtra,
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
