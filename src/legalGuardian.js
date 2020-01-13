import React from 'react';
import './App.css';


class LegalGuardian extends React.Component {
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
        Welcome, dear parent
      </div>
    )
  }
}

export default LegalGuardian;
