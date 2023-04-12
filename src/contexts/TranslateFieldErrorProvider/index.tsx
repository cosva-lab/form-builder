import React from 'react';
import type { Message } from '../../types';
import { useGlobalTranslate } from '../GlobalTranslate';

type Translator = (props: Message) => React.ReactNode;

const TranslateFieldErrorContext =
  React.createContext<Translator | null>(null);

const useTranslateFieldError = () =>
  React.useContext(TranslateFieldErrorContext);

export const TranslateFieldErrorProvider = ({
  children,
  translator,
}: React.PropsWithChildren<{
  translator: Translator;
}>) => (
  <TranslateFieldErrorContext.Provider value={translator}>
    {children}
  </TranslateFieldErrorContext.Provider>
);
export const TranslateFieldErrorConsumer =
  TranslateFieldErrorContext.Consumer;

export const TranslateFieldError: React.FC<Message> = (props) => {
  const translate = useTranslateFieldError();
  const fieldTranslate = useGlobalTranslate();
  return <>{(translate || fieldTranslate)(props)}</>;
};
