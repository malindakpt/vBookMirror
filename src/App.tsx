import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/container/header/Header';
import Footer from './components/presentational/footer/Footer';
import Router from './components/router/Router';
import { Snack, State } from './components/presentational/snackbar/Snack';
import { adminEmail } from './data/Config';

export interface IContext {
  email: string | null;
  isTeacher: boolean;
  breadcrumbs?: any[];
  setIsTeacher: (isTeacher: boolean) => void;
  setEmail: (email: string|null) => void,
  updateBreadcrumbs: (bcrumbs: any) => void;
  showSnackbar:(message: string) => void;
  isAdmin: () => boolean;
}

const initialState = {
  email: null,
  isTeacher: false,
  breadcrumbs: [],
  setIsTeacher: (isTeacher: boolean) => {},
  setEmail: (email: string|null) => {},
  updateBreadcrumbs: (bcrumbs: any) => {},
  showSnackbar: (message: string) => {},
  isAdmin: () => false,
};
export const AppContext = React.createContext<IContext>(
  initialState,
);

const App: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState<any>([]);
  const [snackText, setSnackText] = useState<string>('');
  const [email, setEmail] = useState<string|null>(null);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);

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

  const isAdmin = () => email === adminEmail;

  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        isTeacher, setIsTeacher, email, breadcrumbs, showSnackbar, setEmail, updateBreadcrumbs, isAdmin,
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
