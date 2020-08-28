import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/container/header/Header';
import Footer from './components/presentational/footer/Footer';
import Router from './components/router/Router';

export const AppContext = React.createContext(
  { user: 'en', breadcrumbs: [], updateBreadcrumbs: (bcrumbs: any) => {} },
);

const App: React.FC = () => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const updateBreadcrumbs = (bcrumbs: any) => {
    setBreadcrumbs(bcrumbs);
  };
  return (
    <BrowserRouter>
      <AppContext.Provider value={{ user: 'fr', breadcrumbs, updateBreadcrumbs }}>
        <Header />
        <Router />
        <Footer />
      </AppContext.Provider>
    </BrowserRouter>
  );
};
export default App;
