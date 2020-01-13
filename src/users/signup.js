import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: "",
      username: "",
      password1: "",
      password2: "",
      email: "",
      access: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    var newState = this.state;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleSubmit(event){
    event.preventDefault();
    axios.post('http://localhost:5000/users/signup',{
        username: this.state.username,
        password1: this.state.password1,
        password2: this.state.password2,
        email: this.state.email,
        access: this.state.access,
    })
    .then((res) => {
      let {data} = res;
      if(!data.success){
        this.setState({error: data.message});
      }
      else{
        this.setState({error: ""});
        //this.props.history.push("/admin")
      }

    }).catch((err) => {
      console.error(err)
    });
  }

  render(){
    return(
      <div>
        <h2>Sign up </h2>
        <p className = 'error'>{this.state.error}</p>
        <form>
          <label className="form-group">Username:
            <input
              className="form-control"
              type="text"
              name='username'
              value={this.state.username}
              onChange={this.handleChange}/>
          </label>
          <label className="form-group">Email:
            <input
              className="form-control"
              type="text"
              name='email'
              value={this.state.email}
              onChange={this.handleChange}/>
          </label >
          <label className="form-group">Password:
            <input
              className="form-control"
              type="password"
              name='password1'
              value={this.state.password1}
              onChange={this.handleChange}/>
          </label>
          <label className="form-group">Confirm password:
            <input
              className="form-control"
              type="password"
              name='password2'
              value={this.state.password2}
              onChange={this.handleChange}/>
          </label>
          <label className="form-group">Access:
            <input
              className="form-control"
              type="text"
              name='access'
              value={this.state.access}
              onChange={this.handleChange}/>
          </label>
          <input
            className='btn btn-primary'
            type="submit"
            value="Sign up"
            onClick={this.handleSubmit}/>
        </form>
      </div>
    )
  }
}

export default withRouter(Signin);
