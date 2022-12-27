import React, { CSSProperties } from 'react';
import Grow from '@mui/material/Grow';
import Loading from '../Loading';
import type { Message } from '../types';

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

const FieldTranslate = React.createContext<
  (props: Props) => React.ReactNode
>(({ message }) => {
  return message;
});

const useFieldTranslate = () => React.useContext(FieldTranslate);

export const FieldTranslateProvider = ({
  children,
  translator,
}: React.PropsWithChildren<{
  translator: (props: Message) => React.ReactNode;
}>) => {
  return (
    <FieldTranslate.Provider value={translator}>
      {children}
    </FieldTranslate.Provider>
  );
};
export const FieldTranslateConsumer = FieldTranslate.Consumer;

const Comp = (props: Message) => {
  const translate = useFieldTranslate();
  return <span>{translate(props)}</span>;
};

export const getMessage: React.FC<Props> = props => {
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

getMessage.defaultProps = {
  styles: {},
  props: {},
};
