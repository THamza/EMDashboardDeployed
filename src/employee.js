import React from 'react';
import './App.css';




class Employee extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data:[]
    }
  }

  render(){
    //let {match} = this.props;
    return(
      <div>
        Welcome, dear employee
      </div>
    )
  }
}

export default Employee;
