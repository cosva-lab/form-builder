import React, { CSSProperties } from 'react';
import Grow from '@mui/material/Grow';
import Loading from '../../Loading';
import type { Message } from '../../types';

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

const GlobalTranslateContext = React.createContext<
  (props: Props) => React.ReactNode
>(({ message }) => message);

export const useGlobalTranslate = () =>
  React.useContext(GlobalTranslateContext);

export const GlobalTranslateProvider = ({
  children,
  translator,
}: React.PropsWithChildren<{
  translator: (props: Message) => React.ReactNode;
}>) => (
  <GlobalTranslateContext.Provider value={translator}>
    {children}
  </GlobalTranslateContext.Provider>
);
export const FieldTranslateConsumer = GlobalTranslateContext.Consumer;

const Comp = (props: Message) => {
  const translate = useGlobalTranslate();
  return <span>{translate(props)}</span>;
};

export const GlobalTranslate: React.FC<Props> = (props) => {
  const { styles, ...rest } = props;
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
      <Comp {...rest} />
    </React.Suspense>
  );
};

GlobalTranslate.defaultProps = {
  styles: {},
  props: {},
};
