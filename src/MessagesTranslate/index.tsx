import React, { CSSProperties } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Grow from '@material-ui/core/Grow';
import Loading from '../Loading';
import { Message } from '../types';

export const Animation = ({
  children,
}: React.PropsWithChildren<any>) => (
  <Grow
    in
    style={{ transformOrigin: '0 0 0' }}
    {...{ timeout: 1000 }}
  >
    {children}
  </Grow>
);

interface Props extends Message {
  styles?: CSSProperties;
}

export const getMessage: React.FC<Props> = prop => {
  const { message, ns, props, styles } = prop;
  return (
    <React.Suspense
      fallback={
        <Animation>
          <div
            style={{
              ...styles,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Loading size={20} />
          </div>
        </Animation>
      }
    >
      {React.createElement(
        withTranslation(ns)(
          ({ t }): React.ComponentElement<WithTranslation, any> => {
            return <span>{t(message, { ...props })}</span>;
          },
        ),
      )}
    </React.Suspense>
  );
};

getMessage.defaultProps = {
  styles: {},
  props: {},
};
