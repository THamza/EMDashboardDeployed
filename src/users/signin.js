import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import GLOBAL from '../utils/global';
import "../custom.css";

class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: "",
      username: "",
      password: "",
      email: ""
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
    axios.post('http://fye-em.aui.ma/signin',{
        identity: this.state.username,
        password: this.state.password
    })
    .then((res) => {
        console.log(res);
      let {data} = res;
      if(data.status !== "success"){
        this.setState({error: data.message});
      }
      else{
          console.log("HERE");
          GLOBAL.AUTH = data.data.appToken.value;
          GLOBAL.HASHEDID = data.data.hashedID;

        this.props.history.push("/admin/statistics");
      }

    }).catch((err) => {
      console.error(err)
    });
  }
  render(){
    return(
      <div className="login_wrapper" >
          {/*<div style={{ backgroundImage: `url(require('../images/icons/signin_background.jpg')})` }}/>*/}
          <img src={require('../images/icons/signin_background.jpg')} style={{
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              flex:1,
              backgroundRepeat: 'no-repeat',
              marginLeft: "-200%",
              marginTop: "-50%"
          }} />
          <div className=" form login_form">
            <section id="signin-content" className="login_content">
                <img src={require('../images/icons/auiLogo.png')} style={{width: '50%', marginTop: '50% ',marginBottom: '15px'}}/>
        <form>
                <h1 className="green" style={{color: '#18632C !important'}}>Admin Sign In</h1>
          <input
            className="form-control"
            type="text"
            id="emailIDSignIn"
            placeholder="Email or ID"
            name='username'
            value={this.state.username}
            onChange={this.handleChange}/>


          <input
            className="form-control"
            type="password"
            name='password'
            id="passwordSignIn"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}/>

          <br/>
          <input
            className="btn green-1"
            type="submit"
            value="Sign in"
            style={{color: '#fff', 
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft:'0px',
            width: '100%'}}
            onClick={this.handleSubmit}/>
        
        <div className="clearfix" />
                
            <div>
            <p style={{fontSize: '11px'}}> Copyright ©  XXXXX <br /><a href="https://www.google.com" style={{marginLeft: '10px'}}>Privacy Policy</a></p>
          </div>

        </form>
            </section>
          </div>
        </div>
    )
  }
}

export default withRouter(Signin);
