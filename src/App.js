import React from "react";
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import StoreContextProvider from './app/store/store'
import AppSwitcher from './app/containers/AppSwitcher'
import ErrorBoundary from './app/components/ui/ErrorBoundary'
import InstantSearches from "app/containers/InstantSearches"
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <div className="App">
      <StoreContextProvider>
        <HelmetProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <InstantSearches>
                <AppSwitcher />
              </InstantSearches>
            </ErrorBoundary>
          </BrowserRouter>
        </HelmetProvider>
      </StoreContextProvider>
    </div>
  );
}

export default App;
