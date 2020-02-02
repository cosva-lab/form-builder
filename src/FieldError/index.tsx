import React from 'react';

interface Props {
  ns?: string;
  props?: any;
}

const FieldError = React.createContext<Props>({ ns: 'validations' });

export const useFieldError = () => React.useContext(FieldError);

export const FieldTranslateProvider = ({
  children,
  ...rest
}: React.PropsWithChildren<Props>) => {
  return (
    <FieldError.Provider value={rest}>{children}</FieldError.Provider>
  );
};
export const FieldErrorConsumer = FieldError.Consumer;
