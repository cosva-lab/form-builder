import React from 'react';
import { FieldRender } from './FieldRender';
import {
  FieldsRenderProps,
  changeField,
  InitialState,
  BaseBuilder,
} from './types';
import FieldBuilder from './utils/builders/FieldBuilder';
import FieldRenderObserve from './FieldRenderObserve';

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
      extra,
      fields,
      getSteps,
      isNew,
      ns,
      transPosition,
      validate,
    } = this.props;
    const common: InitialState & BaseBuilder = {
      changeField: this.changeField,
      extra,
      getFields: () => this.props.fields,
      getSteps,
      isNew,
      validate,
    };
    return (
      <>
        {fields.map(field => {
          if (field instanceof FieldBuilder) {
            if (!field.transPosition && transPosition)
              field.transPosition = transPosition;
            return (
              <FieldRenderObserve
                key={field.name}
                fieldProxy={field}
                {...common}
              />
            );
          }
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
              {...{
                ...field,
                label,
                ns: field.ns || ns,
                ...common,
              }}
            />
          );
        })}
      </>
    );
  }
}

export default FieldsRender;
