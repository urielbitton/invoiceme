import React from "react";
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import StoreContextProvider from './app/store/store'
import AppSwitcher from './AppSwitcher'
import ErrorBoundary from './app/utils/ErrorBoundary'
import InstantSearches from "app/containers/InstantSearches"

function App() {
  return (
    <div className="App">
      <StoreContextProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <InstantSearches>
              <AppSwitcher />
            </InstantSearches>
          </ErrorBoundary>
        </BrowserRouter>
      </StoreContextProvider>
    </div>
  );
} 

export default App;
