import React, { Component } from 'react';
import Signup from './Signup.js';
import Login from './Login.js';
import MenuBar from './Navbar.js';
import Room from './Room.js';
import {
  Switch,
  Route
} from "react-router-dom";



export default class App extends Component {
  constructor(props) {
    super(props);
    this.auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
  }

  render() {
    return (
      <div>
          <MenuBar />
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/signup" component={Signup}/>
            <Route path="/room/:id" render = {() => <Room { ...this.props }/>}/>
          </Switch>
      </div >
    )
  }
}