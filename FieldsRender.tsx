import * as React from 'react';
import compose from 'recompose/compose';
import withStyles, {
  WithStyles,
} from '@material-ui/core/styles/withStyles';
import { FormBuilder } from '.';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import FieldRender from './FieldRender';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  });

interface AllFieldsRenderProps
  extends FormBuilder.FieldsRender,
    Partial<WithStyles<typeof styles>> {}
// eslint-disable-next-line react/no-multi-comp
class FieldsRender extends React.PureComponent<AllFieldsRenderProps> {
  static defaultProps = {
    ns: 'inputs',
    transPosition: '',
  };

  render() {
    const {
      fields,
      validate,
      handleChange,
      actionsExtra,
      ns,
      transPosition,
    } = this.props;
    if (!fields) return null;
    return (
      <React.Fragment>
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
          const { searchField, id } = extraProps || {
            searchField: false,
            id: null,
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
          } else if (id) {
            try {
              // eslint-disable-next-line no-restricted-globals
              if (id && !isNaN(Number(id))) {
                extraProps = {
                  ...extraProps,
                  search: {
                    state: true,
                    value: Number(id),
                  },
                };
              } else {
                throw new Error(
                  `El campo ${field.name} tiene valor no permitido!`,
                );
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
                transPosition,
                label,
                validate,
                actionsExtra,
                handleChange,
                search,
              }}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

export default compose<
  FormBuilder.FieldsRender,
  AllFieldsRenderProps
>(withStyles(styles, { name: 'FieldsRender' }))(FieldsRender);
