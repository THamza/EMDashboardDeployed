import React from 'react'
import {withRouter} from 'react-router-dom';
import {getFromStorage,setInStorage} from './../utils/storage'
import {getUser, logout} from './../utils/requests'

//import PropTypes from 'prop-types'

/*
This component will serve as a bar for the user and will allow logout and access to user settings
*/

class UserBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: '',
      token: getFromStorage("token")
    }
    this.onClick = this.onClick.bind(this);
  }

  onClick(e){
    e.preventDefault();

    logout()
    .then((res) => {
      console.log(res);
      setInStorage("token",null)
      this.props.history.push('/');
    })
  }

  componentWillMount() {
    
  }



  render () {
    return (
      <div className="userBar">
      <p className="left">User: {this.state.value}</p>
      <a href="" className="btn-link right"
        onClick={this.onClick}>
        Logout</a>
      </div>
    )
  }
}

export default withRouter(UserBar);
