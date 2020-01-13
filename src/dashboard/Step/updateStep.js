import React, { Component } from 'react';

import {
    postStepLocationUpdateAPICALL,
    postDeleteStepAPICALL,
    postStepUpdateAPICALL,
    getParticipantsDataAPICall
} from '../../utils/requests';
import {withRouter} from 'react-router-dom';
import Form from "react-jsonschema-form";
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

const uiSchema = {
    createdAt: {
        "ui:readonly": true
    },
    updatedAt: {
        "ui:readonly": true
    },
    eventHashedID: {
        "ui:readonly": true
    },
    stepHashedID: {
        "ui:readonly": true
    }

};


const schema = {
    "title": "Update Step",
    "description": "Update an existing step",
    "type": "object",
    "required": [
        "stepTitle",
        "stepDescription"
    ],
    "properties": {
        "eventHashedID": {
            "type": "string",
            "title": "Event System ID"
        },
        "stepHashedID": {
            "type": "string",
            "title": "Step System ID"
        },
        "createdAt": {
            "type": "string",
            "title": "Created At"
        },
        "updatedAt": {
            "type": "string",
            "title": "Last Updated At"
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


class UpdateStep extends Component {
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
        console.log("DOZNLOQD");
        console.log(this.props.history.location.state.data.data.data);


        schema.properties.eventHashedID.default = this.props.history.location.state.data.data.data.hashedIDEvent;
        schema.properties.createdAt.default = this.props.history.location.state.data.data.data.createdAtConverted;
        schema.properties.updatedAt.default = this.props.history.location.state.data.data.data.updatedAtConverted;
        schema.properties.stepHashedID.default = this.props.history.location.state.data.data.data.hashedIDStep;
        schema.properties.stepTitle.default = this.props.history.location.state.data.data.data.stepTitle;
        schema.properties.stepDescription.default = this.props.history.location.state.data.data.data.stepDescription;

        // Bind
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this);
        this.handleEndDateTimeChange = this.handleEndDateTimeChange.bind(this);
        this.updateLocationOfStep = this.updateLocationOfStep.bind(this);
        this.onSubmitStepUpdate = this.onSubmitStepUpdate.bind(this);

    }

    componentDidMount(){

    }

    deleteStep(hashedIDEvent, hashedIDStep){
        return postDeleteStepAPICALL(hashedIDEvent, hashedIDStep)
            .then(isDelete => {
                return isDelete;
            })
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


    updateLocationOfStep () {
        if(this.state.commonLocation !== -1){
            this.state.position.lat = MAP_MARKERS[this.state.commonLocation].latitude;
            this.state.position.lng = MAP_MARKERS[this.state.commonLocation].longitude;
        }
        return postStepLocationUpdateAPICALL(this.props.history.location.state.data.data.data.hashedIDEvent, this.props.history.location.state.data.data.data.hashedIDStep, this.state.position.lat, this.state.position.lng, this.state.commonLocation)
            .then((isChanged) => {

                if (isChanged) {
                    alert("Step Location Updated Successfully");
                } else {
                    alert("An error has happened while updating the location of the step");
                }

            })
    }

    getParticipantsData(usersIDs, hashedIDEvent, hashedIDStep, type){
        return getParticipantsDataAPICall(usersIDs)
            .then(data => {
                if(data.status!=="success"){
                    alert("Could not get participants info");
                }else{
                    console.log(data);
                    switch(type){
                        case "completions":
                            console.log(data.data);
                            this.props.history.push('/admin/view-completions', {CompletionsReady: data.data, hashedIDEvent: hashedIDEvent, hashedIDStep: hashedIDStep});
                            break;
                        case "scanners": this.props.history.push('/admin/view-scanners', {ScannersReady: data.data, hashedIDEvent: hashedIDEvent, hashedIDStep: hashedIDStep});
                            break;
                        default: console.log("Unrecognized type");
                    }
                }
            })
    }

    onSubmitStepUpdate = function({formData}, e) {
        return postStepUpdateAPICALL(this.props.history.location.state.data.data.data.hashedIDEvent, this.props.history.location.state.data.data.data.hashedIDStep, formData.stepTitle, formData.stepDescription)
            .then(hashedIDStepUpdated => {
                console.log(hashedIDStepUpdated);
                this.setState({
                    eventID: hashedIDStepUpdated
                });
                if(hashedIDStepUpdated.length === 24){
                    // GLOBAL.HASHEDIDEVENTCREATED = hashedIDStepUpdated;
                    alert("Step Updated Successfully");
                    //     this.forceUpdate();
                }else{
                    alert("An error has occurred while updating the step");
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
                          onSubmit={this.onSubmitStepUpdate}
                          onError={console.log("errors")} />


                    {/*Update Date and Time*/}

                    {/*Update Location*/}
                    <Popup
                        ref={"popupEventLocationBtn"}
                        className='popup'
                        trigger={<button className='btn btn-primary' ref={"popupEventLocationBtn"}>Update Location</button>}
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
                                    this.updateLocationOfStep();
                                }}>Bind Location to Step</button>
                            </div>


                        </div>

                    </Popup>

                    {/*View Participants*/}

                    <button className='btn btn-warning' onClick={()=>{
                        this.getParticipantsData(this.props.history.location.state.data.data.data.peopleCompletedIDs, this.props.history.location.state.data.data.data.hashedIDEvent, this.props.history.location.state.data.data.data.hashedIDStep, "completions");
                        // this.props.history.push('/admin/view-participants', {ParticipantsReady: this.props.history.location.state.data.data.data.ParticipantsReady});
                    }}>View Completions</button>


                    <button className='btn btn-warning' onClick={()=>{
                        console.log("there");
                        console.log(this.props.history.location.state.data.data.data.scanners);
                        this.getParticipantsData(this.props.history.location.state.data.data.data.scanners, this.props.history.location.state.data.data.data.hashedIDEvent, this.props.history.location.state.data.data.data.hashedIDStep, "scanners");
                    }}>View Scanners</button>

                    <button className='btn btn-dark' onClick={()=>{
                        this.props.history.push('/admin/step-statistics',{hashedIDEvent: this.props.history.location.state.data.data.data.hashedIDEvent, hashedIDStep: this.props.history.location.state.data.data.data.hashedIDStep});
                    }}>Statistics</button>

                    <button style={{position: "absolute", right: 0}} className='btn btn-danger' onClick={()=>{
                        console.log(this.props.history.location.state.data.data.data.stepTitle);
                        let answer = window.prompt("Are you sure want to delete this Step? Please enter the title of the step:")

                        if(answer === this.props.history.location.state.data.data.data.stepTitle){
                            // console.log(this.props.history.location.state.eventID,props.original.hashedIDStep);
                            return this.deleteStep(this.props.history.location.state.eventID,  this.props.history.location.state.data.data.data.hashedIDStep)
                                .then((isDeleted) => {
                                    if(isDeleted){
                                        alert("Step deleted successfully");
                                    }
                                })
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


export default withRouter(UpdateStep);