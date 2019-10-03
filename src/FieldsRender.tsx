import * as React from 'react';
import compose from 'recompose/compose';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import { FormBuilder } from '.';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import FieldRender from './FieldRender';
import { changeField } from './index';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  });

interface AllFieldsRenderProps
  extends FormBuilder.Fields,
    WithStyles<typeof styles> {}

class FieldsRender extends React.PureComponent<AllFieldsRenderProps> {
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
    if (!fields) return null;

    return (
      <>
        {this.props.fields.map(field => {
          const {
            label = {
              message: field.name,
              ns,
              notPos: !!transPosition,
            },
          } = field;
          return (
            <FieldRender
              ns={ns}
              key={field.name}
              fieldProxy={field}
              {...{
                ...field,
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

export default compose<AllFieldsRenderProps, FormBuilder.Fields>(
  withStyles(styles, { name: 'FieldsRender' }),
)(FieldsRender);
