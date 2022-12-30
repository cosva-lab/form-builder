import React from 'react';

import type { ComponentErrorsProps, Message } from './types';
import { getMessage } from './FieldTranslate';
import { useFieldError } from './FieldError/index';

function isMessage(args: any): args is Message {
  return (
    args &&
    typeof args === 'object' &&
    typeof args.message === 'string'
  );
}

export const RenderErrorsDefault = ({
  errors,
  field,
}: ComponentErrorsProps) => {
  const ns = field && field.ns;
  const common = useFieldError();
  return (
    <div>
      {errors.map((error, i) => {
        if (React.isValidElement<any>(error))
          return <error.type {...error.props} key={error.key || i} />;
        return typeof error === 'string' ? (
          <div key={i}>{error}</div>
        ) : isMessage(error) ? (
          <div key={i}>{getMessage({ ns, ...common, ...error })}</div>
        ) : (
          Object.values(error).map((e, j) => {
            return (
              <div key={j}>
                {typeof e === 'string'
                  ? e
                  : (isMessage(e) &&
                      getMessage({ ns, ...common, ...e })) ||
                    null}
              </div>
            );
          })
        );
      })}
    </div>
  );
};
