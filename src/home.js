import React from 'react';
import Signin from './users/signin';
import Signup from './users/signup';
//import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';


class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      signin: true,
      token: ''
    }
    this.goAdmin = this.goAdmin.bind(this);
    this.goEmployee = this.goEmployee.bind(this);
    this.goLegalGuardian = this.goLegalGuardian.bind(this);
    this.switch = this.switch.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  goAdmin(){
    this.props.history.push("/admin")
  }
  goEmployee(){
    this.props.history.push("/employee")
  }
  goLegalGuardian(){
    this.props.history.push("/legalGuardian")
  }

  toggle(event){
    event.preventDefault();
    console.log("Toggle called");
    this.setState({signin:!this.state.signin})
  }

  switch(){
    if(this.state.signin){
      return(
        <div className="separator">
          <p className="change_link">
              <br/>
            <Signin />
              <button className="btn btn-link"
                style={{color: 'rgb(255,255,255)'}}
                onClick={this.toggle}>
                Sign n
            </button>
          </p>
          <div className="clearfix" />
          <br />
          </div>
      )
    } else {
      return(
        <div className="sign">
          <br/>
          <Signup />
          Already have an account?
          <button className="btn btn-link"
            onClick={this.toggle}>
            Sign in
          </button>
        </div>
      )
    }
  }

  render(){
    return(
      <div className = "home">
        {this.switch()}
        <br/><br/><br/><br/><br/>
      </div>
    )
  }
}


export default Home;
