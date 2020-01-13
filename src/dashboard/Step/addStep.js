import React, { Component } from 'react';
import LocationPicker from 'react-location-picker';
import {postStepCreationAPICALL, postStepLocationUpdateAPICALL} from '../../utils/requests';
import GLOBAL from "../../utils/global";
import Form from "react-jsonschema-form";
import {withRouter} from 'react-router-dom';
import Popup from 'reactjs-popup';
import {MAP_MARKERS_NAMES} from "../../utils/mapMarkers";
import {MAP_MARKERS} from "../../utils/mapMarkers";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

/* Default position */
const defaultPosition = {
  lat: 33.538379,
  lng: -5.105569
};

const uiSchema = {
    eventTitle: {
        "ui:readonly": true
    },
    eventHashedID: {
        "ui:readonly": true
    },
};


const schema = {
  "title": "Add Step",
  "description": "Create a new step",
  "type": "object",
  "required": [
    "stepTitle",
    "stepDescription",
  ],
  "properties": {
      "eventHashedID": {
          "type": "string",
          "title": "Event ID"
      },
      "eventTitle": {
          "type": "string",
          "title": "Event Title"
      },
    "stepTitle": {
      "type": "string",
      "title": "Step Title"
    },
    "stepDescription": {
      "type": "string",
      "title": "Step Description"
    }
  }
};

class AddStep extends Component {
  constructor (props) {
    super(props);

    this.state = {
      position: {
         lat: 0,
         lng: 0
      },
        stepID: "",
        eventID: "",
        commonLocation: -1
    };


      if(GLOBAL.HASHEDIDEVENTCREATED !== "")
          schema.properties.eventHashedID.default = GLOBAL.HASHEDIDEVENTCREATED;

      if(GLOBAL.EVENTTITLE !== "")
          schema.properties.eventTitle.default = GLOBAL.EVENTTITLE;

    // Bind
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.updateLocationOfStep = this.updateLocationOfStep.bind(this);
    this.onSubmitStepCreation = this.onSubmitStepCreation.bind(this);

  }

  handleLocationChange ({ position, address }) {
    // Set new location
      this.setState({
          position: position
      });
  }
    
    updateLocationOfStep () {
        if(this.state.commonLocation !== -1){
            this.state.position.lat = MAP_MARKERS[this.state.commonLocation].latitude;
            this.state.position.lng = MAP_MARKERS[this.state.commonLocation].longitude;
        }
        return postStepLocationUpdateAPICALL(this.state.eventID, this.state.stepID,this.state.position.lat, this.state.position.lng, this.state.commonLocation)
        .then((isChanged) => {
            if (isChanged) {
                alert("Step Created and Location Set Successfully");
                this.props.history.push('add-step');
                this.forceUpdate();
            } else {
                alert("An error has happened while binding the location");
                this.forceUpdate();
            }
        })
        
  }
    
    
    

    onSubmitStepCreation = function({formData}, e) {
        return postStepCreationAPICALL(formData.eventHashedID, formData.stepTitle, formData.stepDescription)
        .then(IDs => {
            console.log("HEE:" + IDs.eventID);
            console.log("HAA:" + IDs.stepID);
            this.setState({
                eventID: IDs.eventID
            });
            this.setState({
                stepID: IDs.stepID
            });
            if(this.state.stepID.length === 24){
                if (window.confirm('Would you like to bind this step to a location?')) {
                    this.refs.popupMapBtn.click();
                } else {
                    alert("Step Created Successfully");
                    this.forceUpdate();
                }
            }
        })

    };

  render () {
    return (
        
      <div>
        <Popup
        ref={"popup"}
        className='popup'
        trigger={<label ref={"popupMapBtn"}></label>}
        position="right center"
        modal
        closeOnDocumentClick>
            
          <div style={{marginBottom: 20, marginTop: 20}}>
        <h3 style={{marginBottom: 20, textAlign: 'center'}}>Pick a location</h3>
        <Dropdown options={MAP_MARKERS_NAMES} onChange={(data) => {
        if(data.label !== "Other")
            this.setState({
                commonLocation: MAP_MARKERS_NAMES.indexOf(data.label)
            });
        else
            this.setState({
                commonLocation: -1
            });

        
    }} value={MAP_MARKERS_NAMES[0]} placeholder="Select an option" />
        </div>
        <div>
          <LocationPicker
            containerElement={ <div style={ {height: '50%'} } /> }
            mapElement={ <div style={ {height: '400px'} } /> }
            defaultPosition={defaultPosition}
            onChange={this.handleLocationChange} />
          <button className='btn btn-outline-success' style={{
            width: '97%'}} onClick={()=>{
                    this.updateLocationOfStep();

            }}>Bind Location to Step</button>  
          </div>
        </Popup>
        
        <Form schema={schema}
              uiSchema={uiSchema}
        onSubmit={this.onSubmitStepCreation}
        onError={console.log("errors")} />


 
      </div>
    )
  }
}

export default withRouter(AddStep);