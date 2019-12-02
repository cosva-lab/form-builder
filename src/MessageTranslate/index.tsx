import React, { CSSProperties } from 'react';
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

const MessageTranslate = React.createContext<
  (props: Props) => React.ReactNode
>(({ message }) => {
  return message;
});
const useMessageTranslate = () => React.useContext(MessageTranslate);
const {
  Provider: ProviderMessageTranslate,
  Consumer: ConsumerMessageTranslate,
} = MessageTranslate;

const Comp = (props: Message) => {
  const translate = useMessageTranslate();
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

export { ProviderMessageTranslate, ConsumerMessageTranslate };
