import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { ComponentErrorsProps, Message } from './types';
import { getMessage } from './FieldTranslate';
import { useFieldError } from './FieldError/index';

const useStyles = makeStyles(() => ({
  spanError: { display: 'block' },
}));

function isMessage(args: any): args is Message {
  return (
    args &&
    typeof args === 'object' &&
    typeof args.message === 'string'
  );
}

export const RenderErrorsDefault = ({
  errors,
  fieldProxy,
}: ComponentErrorsProps) => {
  const ns = fieldProxy && fieldProxy.ns;
  const { spanError } = useStyles();
  const common = useFieldError();
  return (
    <>
      {errors.map((error, i) => {
        if (React.isValidElement<any>(error))
          return <error.type key={error.key || i} />;
        return typeof error === 'string' ? (
          <span className={spanError} key={i}>
            {error}
          </span>
        ) : isMessage(error) ? (
          <span className={spanError} key={i}>
            {getMessage({ ns, ...common, ...error })}
          </span>
        ) : (
          Object.values(error).map((e, j) => {
            return (
              <span className={spanError} key={j}>
                {typeof e === 'string'
                  ? e
                  : (isMessage(e) &&
                      getMessage({ ns, ...common, ...e })) ||
                    null}
              </span>
            );
          })
        );
      })}
    </>
  );
};
