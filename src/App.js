import React from 'react';
import './App.css';
import './views/styles/HomeStyle.css';

import Routes from './views/navigation/Routes';

function App() {
  return (
  
    <div className="App">
      {/* Bar navigation */}
      {/* <NavBar></NavBar> */}
      {/* Conten main */}
      <Routes/>     
    </div>
  );
}

export default App;
