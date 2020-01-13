import React from 'react'
import {withRouter} from 'react-router-dom';
import columns from './columns';
import List from './list.js';

class Offering extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      offering: null
    }
  }


  render () {
    let {match} = this.props;
    let {params} = match;
    let {offering, service, name, classroom} = params;
    let fixed  = {
      offering: offering
    }

    return (
      <div>
        <h2 className='title'>{name} | Classroom {classroom}</h2>

        <div className="row inside">
          <div className="column">
            <h4>Beneficiaries</h4>
            <List
              title = "Beneficiary"
              link = 'beneficiary'
              object = 'enroll'
              fixed = {fixed}
              columns = {columns.enroll}
              />
          </div>
          <div className="column">
            <h4>Caretakers</h4>
              <List
                title = "Employee"
                link = 'employee'
                object = 'supervise'
                fixed = {fixed}
                columns = {columns.supervise}
                />
          </div>
          <div className="column">
            <h4>Times</h4>
          </div>
        </div>
      </div>

    )
  }
}

export default withRouter(Offering);
