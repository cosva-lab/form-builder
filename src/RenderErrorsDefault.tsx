import React from 'react';

import type { ComponentErrorsProps, Message } from './types';
import { useFieldError } from './FieldError';
import { TranslateFieldError } from './contexts/TranslateFieldErrorProvider';

function isMessage(args: any): args is Message {
  return (
    args &&
    typeof args === 'object' &&
    typeof args.message === 'string'
  );
}

interface SpanFullWidthProps {
  children: React.ReactNode;
}

const Text = ({ children }: SpanFullWidthProps) => (
  <div>{children}</div>
);

export const RenderErrorsDefault = ({
  errors,
  field,
}: ComponentErrorsProps) => {
  const ns = field && field.ns;
  const common = useFieldError();
  return (
    <>
      {errors.map((error, i) => {
        if (React.isValidElement<any>(error))
          return <error.type {...error.props} key={error.key || i} />;
        return typeof error === 'string' ? (
          <Text key={i}>{error}</Text>
        ) : isMessage(error) ? (
          <Text key={i}>
            <TranslateFieldError {...{ ns, ...common, ...error }} />
          </Text>
        ) : (
          Object.values(error).map((e, j) => {
            return (
              <Text key={j}>
                {typeof e === 'string'
                  ? e
                  : (isMessage(e) && (
                      <TranslateFieldError
                        {...{ ns, ...common, ...e }}
                      />
                    )) ||
                    null}
              </Text>
            );
          })
        );
      })}
    </>
  );
};
