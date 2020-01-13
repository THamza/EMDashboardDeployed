import React, { Component } from 'react';

import {
    postEventUpdateAPICALL,
    postEventLocationUpdateAPICALL,
    postEventDateTimeUpdateAPICALL,
    postDeleteEventAPICALL,
    getParticipantsDataAPICall
} from '../../utils/requests';
import GLOBAL from "../../utils/global";
import {withRouter} from 'react-router-dom';
import Form from "react-jsonschema-form";
import DatePicker from "react-datepicker";
import Dropdown from "react-dropdown";
import {MAP_MARKERS, MAP_MARKERS_NAMES} from "../../utils/mapMarkers";
import LocationPicker from "react-location-picker";
import Popup from "reactjs-popup";

import "react-datepicker/dist/react-datepicker.css";


/* Default position */
const defaultPosition = {
    lat: 33.538379,
    lng: -5.105569
};

const uiSchema = {
    createdAt: {
        "ui:readonly": true
    },
    updatedAt: {
        "ui:readonly": true
    },
    eventHashedID: {
        "ui:readonly": true
    }
};


const schema = {
    "title": "Update Event",
    "description": "Update an existing event",
    "type": "object",
    "required": [
        "eventTitle",
        "eventDescription",
        "maxParticipants"
    ],
    "properties": {
        "eventHashedID": {
            "type": "string",
            "title": "Event System ID"
        },
        "createdAt": {
            "type": "string",
            "title": "Created At"
        },
        "updatedAt": {
            "type": "string",
            "title": "Last Updated At"
        },
        "adminAUIID": {
            "type": "string",
            "title": "Admin AUI ID"
        },
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
        }
    }
};


class UpdateEvent extends Component {                                              
  constructor (props) {                                                            
    super(props);                                                                  
    this.state = {                                                                 
        startDate: new Date(this.props.history.location.state.data.data.data.startDate),
        endDate: new Date(this.props.history.location.state.data.data.data.endDate),
        // startDate: "",
        // endDate: "",
        position: {                                                                
            lat: 0,                                                                
            lng: 0                                                                 
        },
        commonLocation: -1
    };
      console.log(this.props.history.location.state.data.data.data);


      schema.properties.eventHashedID.default = this.props.history.location.state.data.data.data.hashedIDEvent;
      schema.properties.createdAt.default = this.props.history.location.state.data.data.data.createdAtConverted;
      schema.properties.updatedAt.default = this.props.history.location.state.data.data.data.updatedAtConverted;
      schema.properties.adminAUIID.default = this.props.history.location.state.data.data.data.adminAUIID;
      schema.properties.eventTitle.default = this.props.history.location.state.data.data.data.eventTitle;
      schema.properties.eventDescription.default = this.props.history.location.state.data.data.data.eventDescription;
      schema.properties.maxParticipants.default = this.props.history.location.state.data.data.data.maxParticipants;
      schema.properties.organizer.default = this.props.history.location.state.data.data.data.organizer;
                                                                                   
    // Bind                                                                        
    this.handleLocationChange = this.handleLocationChange.bind(this);              
    this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this);    
    this.handleEndDateTimeChange = this.handleEndDateTimeChange.bind(this);        
    this.updateLocationOfEvent = this.updateLocationOfEvent.bind(this);
    this.onSubmitEventUpdate = this.onSubmitEventUpdate.bind(this);

  }

    componentDidMount(){

    }

    handleStartDateTimeChange(date) {
        this.setState({
            startDate: date
        });
        // console.log(this.state.startDate);
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

    deleteEvent(hashedIDEvent){
        return postDeleteEventAPICALL(hashedIDEvent)
            .then(isDelete => {
                return isDelete;
            })
    }


    updateLocationOfEvent () {
        if(this.state.commonLocation !== -1){
            this.state.position.lat = MAP_MARKERS[this.state.commonLocation].latitude;
            this.state.position.lng = MAP_MARKERS[this.state.commonLocation].longitude;
        }
        return postEventLocationUpdateAPICALL(this.props.history.location.state.data.data.data.hashedIDEvent, this.state.position.lat, this.state.position.lng, this.state.commonLocation)
            .then((isChanged) => {
                if (isChanged) {
                    alert("Event Updated Successfully");
                } else {
                    alert("An error has happened while updating the location of the event");
                }

            })
    }

    getParticipantsData(usersIDs, hashedIDEvent, type){
        return getParticipantsDataAPICall(usersIDs)
            .then(data => {
                if(data.status!=="success"){
                    alert("Could not get participants info");
                }else{
                    console.log(data.data);
                    switch(type){
                        case "participants": this.props.history.push('/admin/view-participants', {ParticipantsReady: data.data, hashedIDEvent: hashedIDEvent});
                            break;
                        case "fullyCompleted": this.props.history.push('/admin/view-fully-completed', {FullyCompletedReady: data.data, hashedIDEvent: hashedIDEvent});
                            break;
                        default: console.log("Unrecognized type");
                    }

                }
            })
    }
    
 onSubmitEventUpdate = function({formData}, e) {
    return postEventUpdateAPICALL(this.props.history.location.state.data.data.data.hashedIDEvent, formData.adminAUIID, formData.eventTitle, formData.eventDescription, formData.maxParticipants, formData.organizer)
        .then(hashedIDEventUpdated => {
            console.log(hashedIDEventUpdated);
            this.setState({
                eventID: hashedIDEventUpdated
            });

            if(hashedIDEventUpdated.length === 25){
                GLOBAL.HASHEDIDEVENTCREATED = hashedIDEventUpdated;
                // if (window.confirm('Would you like to bind this event to a location?')) {
                //     this.refs.popupEventBtn.click();
                // } else {
                    alert("Event Updated Successfully");
                //     this.forceUpdate();
                // }
            }
        })
};



  render () {
    return (   
      <div>
        <div>
            <Form schema={schema}
                  uiSchema={uiSchema}
            onChange={console.log("changed")}
            onSubmit={this.onSubmitEventUpdate}
            onError={console.log("errors")} />


            {/*Update Date and Time*/}
            <Popup
                ref={"popupEventDateAndTimeBtn"}
                className='popup'
                trigger={<button className='btn btn-primary' ref={"popupEventDateAndTimeBtn"}>Update Dates</button>}
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

                        <button className='btn btn-primary' onClick={() => {
                            return postEventDateTimeUpdateAPICALL(this.props.history.location.state.data.data.data.hashedIDEvent,this.state.startDate, this.state.endDate)
                                .then((isChanged) => {
                                    if (isChanged) {
                                        alert("Event Date Updated Successfully");
                                    } else {
                                        alert("An error has happened while updating the date");
                                        this.forceUpdate();
                                    }
                                })
                        }}>Submit</button>
                    </div>
                </div>
            </Popup>

            {/*Update Location*/}
            <Popup
                ref={"popupEventLocationBtn"}
                className='popup'
                trigger={<button className='btn btn-success' ref={"popupEventLocationBtn"}>Update Location</button>}
                position="right center"
                modal
                closeOnDocumentClick>

                <div style={{marginBottom: 20, marginTop: 20}}>

                    <h3 style={{marginBottom: 20, textAlign: 'center'}}>Pick a location</h3>
                    <Dropdown style={{marginBottom: 20}} options={MAP_MARKERS_NAMES} onChange={(data) => {
                        if(data.label !== "Other")
                            this.setState({
                                commonLocation: MAP_MARKERS_NAMES.indexOf(data.label)
                            });
                        else
                            this.setState({
                                commonLocation: -1
                            });
                        

                    }} value={MAP_MARKERS_NAMES[0]} placeholder="Select an option" />
                    <div>
                        <LocationPicker
                            containerElement={ <div style={ {height: '50%'} } /> }
                            mapElement={ <div style={ {height: '400px'} } /> }
                            defaultPosition={defaultPosition}
                            onChange={this.handleLocationChange} />
                        <button className='btn btn-outline-success' style={{
                            width: '97%'}} onClick={()=>{
                            this.updateLocationOfEvent();
                        }}>Bind Location to Event</button>
                    </div>


                </div>

            </Popup>

            {/*View Participants*/}

            <button className='btn btn-warning' onClick={()=>{
                this.getParticipantsData(this.props.history.location.state.data.data.data.participantIDs, this.props.history.location.state.data.data.data.hashedIDEvent, "participants");
                // this.props.history.push('/admin/view-participants', {ParticipantsReady: this.props.history.location.state.data.data.data.ParticipantsReady});
            }}>View Participants</button>


            <button className='btn btn-warning' onClick={()=>{
                this.getParticipantsData(this.props.history.location.state.data.data.data.fullyCompletedIDs, this.props.history.location.state.data.data.data.hashedIDEvent, "fullyCompleted");
            }}>View Fully Completed</button>

            <button className='btn btn-dark' onClick={()=>{
                this.props.history.push('/admin/event-statistics',{hashedIDEvent: this.props.history.location.state.data.data.data.hashedIDEvent});
            }}>Statistics</button>

            <button style={{position: "absolute", right: 0}} className='btn btn-danger' onClick={()=>{
                let answer = window.prompt("Are you sure want to delete this Event? Please enter the title of the event:")
                if(answer === this.props.history.location.state.data.data.data.eventTitle){
                    this.deleteEvent(this.props.history.location.state.data.data.data.hashedIDEvent);
                }else{
                    alert("The titles don't match. Aborting...")
                }
                console.log(answer);
            }}>Delete</button>



        </div>
      </div>
    )
  }
}


export default withRouter(UpdateEvent);