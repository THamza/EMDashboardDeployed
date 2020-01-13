import React from 'react';
import AddForm from './addForm'
import Popup from 'reactjs-popup';

class PopupButton extends React.Component {

  render(){
    let {name, object, columns} = this.props;
    return (
      <div>
          <Popup
          className='popup'
          trigger={<button className='btn btn-outline-success'> New</button>}
          position="right center"
          modal
          closeOnDocumentClick>
          <div>
            <div className="header"> <h2>New {name}</h2></div>
            <div className="content">
                <AddForm
                  object = {object}
                  columns = {columns}
                  fixed = {this.props.fixed}
                />
            </div>
          </div>
        </Popup>
        </div>
      )
  }
}

export default PopupButton;
