import React, { Component } from 'react';
import AppNavbar from './components/navbar/navbar';
import './App.css';
import { BrowserRouter as Router, Route, IndexRoute } from 'react-router-dom';

import Home from './components/home/home';
import NewPage from './components/newPage/newpage';
import selectedPage from './components/selectedPage/selectedPage';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Router>
            <div>
              <AppNavbar />
              <Route exact path="/" component={Home}/>
              <Route path="/newPage" component={NewPage}/>
              <Route path="/selectedPage" component={selectedPage}/>
              {/* <Home /> */}
            </div>
          </Router>
      </div>
    );
  }
}

export default App;
