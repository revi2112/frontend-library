import React from 'react';
import './App.css';

import { HomePage } from './Layouts/HomePage/HomePage';
import { SearchBooksPage } from './Layouts/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Navbar } from './Layouts/NavbarAndFooter/Navbar';
import { Footer } from './Layouts/HomePage/Components/Footer';
import { BookCheckoutPage } from './Layouts/BookCheckoutPage/BookCheckoutPage';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import { auth0Config } from './lib/auth0Config';
import { LoginPage } from './Auth/LoginPage';
// / home /search home and search
// /search with switch taks / first matching route

// wrapper component connecting react frontend to Auth0 secure hosted web login
/*
The useHistory hook gives you access to the history instance/ obj. It has info about current url as well as previous and next url in his stack
we can navigate in stack It allows React to change the URL without refreshing the page.
children: React.ReactNode (component is a container which is rECT NODE) anything React can render

childeren lets you nest one comp in another,
*/
const Auth0ProviderWithHistory = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();

  // once user logs in at AuthO they are redirected by and it sends appState.
  // appState (page they will go after login )
  const onRedirectCallback = (appState: any) => {
    history.push(appState?.returnTo || "/home");
  };

  return (
    <Auth0Provider
      domain={auth0Config.issuer}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        // audience: auth0Config.audience,
        scope: auth0Config.scope,
      }} 
       onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

const SecureRoute = ({ component, path, ...args }: { component: React.ComponentType<any>, path: string }) => (
  <Route path={path} component={withAuthenticationRequired(component)} {...args} />
);
function App() {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Auth0ProviderWithHistory>
      <Navbar/>
      <div className='flex-grow-1'>

      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <HomePage />
        </Route>
        <SecureRoute path='/search' component={SearchBooksPage} />
        <Route path='/checkout/:bookId'>
          <BookCheckoutPage />
        </Route>
        <Route path='/login' render={() => <LoginPage />} />
      </Switch>
      </div>

      <Footer/>
      </Auth0ProviderWithHistory>
    </div>

  );
}

export default App;
