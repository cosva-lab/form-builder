import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { ComponentErrorsProps, Message } from './types';
import { getMessage } from './FieldTranslate';

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
}: ComponentErrorsProps) => {
  const { spanError } = useStyles();

  return (
    <div>
      {typeof errors === 'string'
        ? errors
        : errors.map((error, i) => {
            if (React.isValidElement<{}>(error)) return error;
            return typeof error === 'string' ? (
              <span className={spanError} key={i}>
                {error}
              </span>
            ) : isMessage(error) ? (
              <span className={spanError} key={i}>
                {getMessage(error)}
              </span>
            ) : (
              Object.values(error).map((e, j) => {
                return (
                  <span className={spanError} key={j}>
                    {typeof e === 'string'
                      ? e
                      : (isMessage(e) && getMessage(e)) || e}
                  </span>
                );
              })
            );
          })}
    </div>
  );
};
