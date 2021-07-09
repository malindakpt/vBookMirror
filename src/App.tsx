import React, { useCallback, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/container/header/Header';
// import Footer from './components/presentational/footer/Footer';
import Router from './components/router/Router';
import { Snack, State } from './components/presentational/snackbar/Snack';
import { ADMIN_EMAIL } from './data/Config';
import {
  PaymentOptionProps,
  PaymentOptions,
} from './components/presentational/paymentOptions/PaymentOptions';
import { setStoreLoadingFunc } from './data/Store';

export interface IContext {
  email: string | null;
  isTeacher: boolean | undefined;
  breadcrumbs?: any[];
  setIsTeacher: (isTeacher: boolean) => void;
  setEmail: (email: string | null) => void,
  updateBreadcrumbs: (bcrumbs: any) => void;
  showSnackbar: (message: string) => void;
  showPaymentPopup: (options: PaymentOptionProps) => void;
  isAdmin: () => boolean;
  // global loading status
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const initialState = {
  email: null,
  isTeacher: false,
  breadcrumbs: [],
  setIsTeacher: (isTeacher: boolean) => { },
  setEmail: (email: string | null) => { },
  updateBreadcrumbs: (bcrumbs: any) => { },
  showSnackbar: (message: string) => { },
  showPaymentPopup: (options: PaymentOptionProps) => { },
  isAdmin: () => false,
  isLoading: false,
  setLoading: (loading: boolean) => { },
};
export const AppContext = React.createContext<IContext>(
  initialState,
);

const App: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const [snackText, setSnackText] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);
  // const [isShowPayment, setShowPayment] = useState<boolean>(true);
  const [paymentOptionProps, setPaymentOptionProps] = useState<PaymentOptionProps | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);

  setStoreLoadingFunc(setLoading);

  // undefined: fetching initial data inprogress
  const [isTeacher, setIsTeacher] = useState<boolean | undefined>(undefined);

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const showSnackbar = useCallback((text: string) => {
    setSnackText(text);
    setState((prev) => {
      const next = { ...prev, open: true };
      return next;
    });
  }, [setSnackText, setState]);

  const showPaymentPopup = (options: PaymentOptionProps) => {
    setPaymentOptionProps(options);
  };

  const hideSnackbar = () => {
    setState((prev) => {
      const next = { ...prev, open: false };
      return next;
    });
  };

  const updateBreadcrumbs = (obj: any) => {
    setBreadcrumbs(obj);
  };

  const isAdmin = () => email === ADMIN_EMAIL;

  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        isTeacher,
        setIsTeacher,
        email,
        breadcrumbs,
        showSnackbar,
        setEmail,
        updateBreadcrumbs,
        isAdmin,
        showPaymentPopup,
        isLoading,
        setLoading,
      }}
      >
        <Snack
          text={snackText}
          state={state}
          handleClose={hideSnackbar}
        />
        {

          paymentOptionProps && (
            <PaymentOptions
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...paymentOptionProps}
              onCancel={() => setPaymentOptionProps(undefined)}
            />
          )
        }
        <Header />
        <Router />
        {/* {isTeacher !== undefined && <Footer />} */}
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
