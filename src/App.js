import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch,  Route } from 'react-router-dom';
import Admin from './admin';
import Home from './home';
import Employee from './employee';
import LegalGuardian from './legalGuardian'

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route
              exact
              path='/'
              component={Home}
              />
            <Route
              path='/admin'
              component={Admin}
              />
            <Route
              path='/employee'
              component={Employee}
              />
            <Route
              path='/legalGuardian'
              component={LegalGuardian}
              />
            </Switch>
        </Router>
      </div>
    );
  }
}

export default App;













// const data = [{
//   registrationNumber: "1",
//   name: "Younes Elhjouji",
//   gender: "male",
//   birthPlace: "Biougra",
//   region: "Souss"
// },{
//   registrationNumber: "2",
//   name: "Reda Herradi",
//   gender: "male",
//   birthPlace: "Casablanca",
//   region: "Grand Casablanca"
// },{
//   registrationNumber: "3",
//   name: "Mehdi Barramou",
//   gender: "male",
//   birthPlace: "Rabat",
//   region: "Grand Rabat"
// }];
