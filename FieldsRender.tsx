import * as React from 'react';
import compose from 'recompose/compose';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import { FormBuilder } from '.';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import FieldRender from './FieldRender';
import { PropsField, changeField } from './index';
import { changeValueFields } from './utils/changeValues';

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

  public fields: PropsField[];

  constructor(props: AllFieldsRenderProps) {
    super(props);
    this.fields = this.props.fields;
  }

  changeField: changeField = (event, callback) => {
    const { target } = event;
    const { value, name } = target;
    this.fields = changeValueFields({
      fields: this.fields,
      action: { name, value },
    });
    this.props.changeField(event, callback);
  };

  UNSAFE_componentWillReceiveProps({ fields }: AllFieldsRenderProps) {
    this.fields = fields;
  }

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
        {fields.map(field => {
          let search = {
            state: false,
            value: -1,
          };
          const {
            label = {
              message: field.name,
              ns,
              notPos: !!transPosition,
            },
          } = field;
          let { extraProps } = field;
          const { searchField } = extraProps || {
            searchField: false,
          };
          if (searchField) {
            let valueSearchId: string | number;
            try {
              switch (typeof searchField) {
                case 'string':
                  valueSearchId = searchField;
                  const fieldFind = fields.find(
                    // eslint-disable-next-line
                    field => field.name == searchField,
                  );
                  if (fieldFind) {
                    search = {
                      state: fieldFind.value !== '',
                      value:
                        fieldFind.value === '' ? -1 : fieldFind.value,
                    };
                  } else {
                    throw new Error(
                      `El input "${field.name}" no existe!`,
                    );
                  }
                  break;
                case 'function':
                  valueSearchId = searchField(fields);
                  extraProps = {
                    ...extraProps,
                    search: {
                      state: true,
                      value: valueSearchId,
                    },
                  };
                  break;
                default:
                  break;
              }
            } catch (e) {
              console.log(e);
            }
          }
          return (
            <FieldRender
              key={field.name}
              ns={ns}
              name={field.name}
              extraProps={extraProps}
              {...{
                ...field,
                extra,
                transPosition,
                label,
                validate,
                actionsExtra,
                changeField: this.changeField,
                search,
                getFields: () => this.fields,
                getSteps,
                isNew,
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
