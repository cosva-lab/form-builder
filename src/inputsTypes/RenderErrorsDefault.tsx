import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { ComponentErrorsProps } from '../types';
import { getMessage } from '../FieldTranslate';

const useStyles = makeStyles(() => ({
  spanError: { display: 'block' },
}));

export const RenderErrorsDefault = ({
  errors,
}: ComponentErrorsProps) => {
  const { spanError } = useStyles();
  return (
    <div>
      {typeof errors === 'string'
        ? errors
        : errors.map((error, i) =>
            typeof error === 'string' ? (
              <span className={spanError} key={i}>
                {error}
              </span>
            ) : (
              Object.values(error).map((e, j) => {
                return (
                  <span className={spanError} key={j}>
                    {typeof e === 'string' ? e : getMessage(e)}
                  </span>
                );
              })
            ),
          )}
    </div>
  );
};
