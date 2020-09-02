import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/container/header/Header';
import Footer from './components/presentational/footer/Footer';
import Router from './components/router/Router';
import { Snack, State } from './components/presentational/snackbar/Snack';

export interface IContext {
  email: string | null;
  breadcrumbs?: any[];
  setEmail: (email: string|null) => void,
  updateBreadcrumbs: (bcrumbs: any) => void;
  showSnackbar:(message: string) => void;
}

const initialState = {
  email: null,
  breadcrumbs: [],
  setEmail: (email: string|null) => {},
  updateBreadcrumbs: (bcrumbs: any) => {},
  showSnackbar: (message: string) => {},
};
export const AppContext = React.createContext<IContext>(
  initialState,
);

const App: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const [snackText, setSnackText] = useState<string>('');
  const [email, setEmail] = useState<string|null>(null);

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const showSnackbar = (text: string) => {
    setSnackText(text);
    setState((prev) => {
      const next = { ...prev, open: true };
      return next;
    });
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

  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        email, breadcrumbs, showSnackbar, setEmail, updateBreadcrumbs,
      }}
      >
        <Snack
          text={snackText}
          state={state}
          handleClose={hideSnackbar}
        />
        <Header />
        <Router />
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
