import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/container/header/Header';
import Footer from './components/presentational/footer/Footer';
import Router from './components/container/router/Router';

const App: React.FC = () => (

  <BrowserRouter>
    <Header />
    <Router />
    <Footer />
  </BrowserRouter>

);
export default App;
