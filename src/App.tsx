import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/container/header/Header';
import Footer from './components/presentational/footer/Footer';
import Router from './components/router/Router';
import { getDocsWithProps } from './data/Store';
import { IExam } from './meta/Interfaces';

export interface IState {
  exams?: IExam[];
  breadcrumbs?: any[];
  updateBreadcrumbs: (bcrumbs: any) => void
}

const initialState = { exams: [], breadcrumbs: [], updateBreadcrumbs: (bcrumbs: any) => {} };
export const AppContext = React.createContext<IState>(
  initialState,
);

const App: React.FC = () => {

  const [state, setState] = useState<IState>(initialState);

  const updateState = (obj: any) => {
    setState((prev: any) => {
      const next = { ...prev, ...obj };
      return next;
    });
  };

  useEffect(() => {
    getDocsWithProps('exams', {}, {}).then((exams) => {
      updateState({ exams });
    });
  }, []);
  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...state }}>
        <Header />
        <Router />
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
