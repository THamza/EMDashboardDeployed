import React, { Component } from 'react';

import {
    postEventCreationAPICALL,
    postEventLocationUpdateAPICALL,
    postEventDateTimeUpdateAPICALL
} from '../../utils/requests';
import GLOBAL from "../../utils/global";
import {withRouter} from 'react-router-dom';
import Form from "react-jsonschema-form";
import DatePicker from "react-datepicker";
import Dropdown from "react-dropdown";
import {MAP_MARKERS_NAMES} from "../../utils/mapMarkers";
import {MAP_MARKERS} from "../../utils/mapMarkers";
import LocationPicker from "react-location-picker";
import Popup from "reactjs-popup";

import "react-datepicker/dist/react-datepicker.css";


/* Default position */
const defaultPosition = {
    lat: 33.538379,
    lng: -5.105569
};



const schema = {
  "title": "Add Event",
  "description": "Create a new event",
  "type": "object",
  "required": [
    "eventTitle",
    "eventDescription",
    "maxParticipants"
  ],
  "properties": {
    "eventTitle": {
      "type": "string",
      "title": "Event Title"
    },
    "eventDescription": {
      "type": "string",
      "title": "Event Description"
    },
    "maxParticipants": {
      "type": "integer",
      "title": "Maximum Participants",
    },
     "organizer": {
        "type": "string",
         "title": "Organizer"
     },
    "isOrdered": {
      "type": "boolean",
      "title": "Ordered",
        "default": false
    }

  }
};

class AddEvent extends Component {
  constructor (props) {
    super(props);
    this.state = {
        startDate: new Date().now,
        endDate: new Date().now,
        position: {
            lat: 0,
            lng: 0
        },
        address: "",
        commonLocation: -1
    };
      
    // Bind
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this);
    this.handleEndDateTimeChange = this.handleEndDateTimeChange.bind(this);
    this.updateDateTimeLocationOfEvent = this.updateDateTimeLocationOfEvent.bind(this);
    this.onSubmitEventCreation = this.onSubmitEventCreation.bind(this);
  }

    handleStartDateTimeChange(date) {
        this.setState({
            startDate: date
        });
    }

    handleEndDateTimeChange(date) {
        this.setState({
            endDate: date
        });
    }


    handleLocationChange ({ position, address }) {

        // Set new location
        this.setState({ position, address });
    }


    updateDateTimeLocationOfEvent () {
        return postEventDateTimeUpdateAPICALL(this.state.eventID,this.state.startDate, this.state.endDate)
            .then((isChanged) => {
                if (isChanged) {
                    if(this.state.commonLocation !== -1){
                        this.state.position.lat = MAP_MARKERS[this.state.commonLocation].latitude;
                        this.state.position.lng = MAP_MARKERS[this.state.commonLocation].longitude;
                    }
                    return postEventLocationUpdateAPICALL(this.state.eventID,this.state.position.lat, this.state.position.lng, this.state.commonLocation)
                        .then((isChanged) => {
                            if (isChanged) {
                                alert("Event Created and Location Set Successfully");
                                this.props.history.push('add-step');
                                this.forceUpdate();
                            } else {
                                alert("An error has happened while binding the location");
                                this.forceUpdate();
                            }
                        })
                } else {
                    alert("An error has happened while binding the date");
                }
            })



    }
    
 onSubmitEventCreation = function({formData}, e) {
    return postEventCreationAPICALL(formData.eventTitle, formData.eventDescription, formData.maxParticipants, formData.isOrdered, formData.organizer)
        .then(hashedIDEventCreated => {
            this.setState({
                eventID: hashedIDEventCreated
            });

            if(this.state.eventID.length === 25){
                GLOBAL.HASHEDIDEVENTCREATED = hashedIDEventCreated;
                // if (window.confirm('Would you like to bind this event to a location?')) {
                    this.refs.popupEventBtn.click();
                // } else {
                //     alert("Event Created Successfully");
                //     this.forceUpdate();
                // }
            }
        })
     
};





  render () {
    return (   
      <div>
        <div>
            {/*PopUp selecting time*/}
            <Popup
                ref={"popupTime"}
                className='popup'
                trigger={<label ref={"popupEventBtn"}></label>}
                position="right center"
                modal
                closeOnDocumentClick>

                <div style={{marginBottom: 20, marginTop: 20}}>
                    <h3 style={{marginBottom: 20, textAlign: 'center'}}>Pick a Date and Time</h3>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', marginRight: 20}}>
                        <DatePicker
                            style={{justifyContent: 'center', textAlign: 'left', marginRight: "20px"}}
                            selected={this.state.startDate}
                            timeInputLabel="Time:"
                            todayButton={"Today"}
                            minDate={new Date()}
                            onChange={this.handleStartDateTimeChange}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            placeholderText="Select a start date"
                        />


                        <DatePicker
                            style={{justifyContent: 'center', textAlign: 'right'}}
                            selected={this.state.endDate}
                            timeInputLabel="Time:"
                            todayButton={"Today"}
                            minDate={new Date()}
                            onChange={this.handleEndDateTimeChange}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            placeholderText="Select an end date"
                        />
                    </div>

                    <h3 style={{marginBottom: 20, textAlign: 'center'}}>Pick a location</h3>
                    <Dropdown style={{marginBottom: 20}} options={MAP_MARKERS_NAMES} onChange={(data) => {
                        if(data.label !== "Other"){
                            this.setState({
                                commonLocation: MAP_MARKERS_NAMES.indexOf(data.label)
                            });
                        }
                        else{
                            this.setState({
                                commonLocation: -1
                            });
                        }

                    }} value={MAP_MARKERS_NAMES[0]} placeholder="Select an option" />
                    <div>
                        <LocationPicker
                            containerElement={ <div style={ {height: '50%'} } /> }
                            mapElement={ <div style={ {height: '400px'} } /> }
                            defaultPosition={defaultPosition}
                            onChange={this.handleLocationChange} />
                        <button className='btn btn-outline-success' style={{
                            width: '97%'}} onClick={()=>{
                            this.updateDateTimeLocationOfEvent();

                        }}>Bind Location to Event</button>
                    </div>


                </div>

            </Popup>

            <Form schema={schema}
            onChange={console.log("changed")}
            onSubmit={this.onSubmitEventCreation}
            onError={console.log("errors")} />



        </div>
      </div>
    )
  }
}


export default withRouter(AddEvent);