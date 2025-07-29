import React from 'react';
import './App.css';

import { HomePage } from './Layouts/HomePage/HomePage';
import { SearchBooksPage } from './Layouts/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Navbar } from './Layouts/NavbarAndFooter/Navbar';
import { Footer } from './Layouts/HomePage/Components/Footer';
// / home /search home and search
// /search with switch taks / first matching route
function App() {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar/>
      <div className='flex-grow-1'>

      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <HomePage />
        </Route>
        <Route path='/search'>
          <SearchBooksPage />
        </Route>
      </Switch>
      </div>

      <Footer/>
    </div>

  );
}

export default App;
