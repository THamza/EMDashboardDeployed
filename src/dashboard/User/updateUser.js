import React, { Component } from 'react';

import {
    postDeleteUserAPICALL,
    postUserUpdateAPICALL,
    getParticipantsDataAPICall
} from '../../utils/requests';
import {withRouter} from 'react-router-dom';
import Form from "react-jsonschema-form";

import "react-datepicker/dist/react-datepicker.css";



const uiSchema = {
    createdAt: {
        "ui:readonly": true
    },
    updatedAt: {
        "ui:readonly": true
    },
    hashedID: {
        "ui:readonly": true
    },
    auiID: {
        "ui:readonly": true
    }

};


const schema = {
    "title": "Update Step",
    "description": "Update an existing step",
    "type": "object",
    "required": [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "gender"
    ],
    "properties": {
        "hashedID": {
            "type": "string",
            "title": "User System ID"
        },
        "createdAt": {
            "type": "string",
            "title": "Created At"
        },
        "updatedAt": {
            "type": "string",
            "title": "Last Updated At"
        },
        "auiID": {
            "type": "string",
            "title": "AUI ID"
        },
        "firstName": {
            "type": "string",
            "title": "First Name"
        },
        "lastName": {
            "type": "string",
            "title": "lastName"
        },
        "email": {
            "type": "string",
            "title": "Email"
        },
        "phoneNumber": {
            "type": "number",
            "title": "Phone Number"
        },
        "gender": {
            "type": "string",
            "title": "Gender"
        }
    }
};


class UpdateUser extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
        console.log("DOZNLOQD");
        console.log(this.props.history.location.state.data.data.data);


        schema.properties.hashedID.default = this.props.history.location.state.data.data.data.hashedID;
        schema.properties.createdAt.default = this.props.history.location.state.data.data.data.createdAtConverted;
        schema.properties.updatedAt.default = this.props.history.location.state.data.data.data.updatedAtConverted;
        schema.properties.auiID.default = this.props.history.location.state.data.data.data.auiID;
        schema.properties.firstName.default = this.props.history.location.state.data.data.data.firstName;
        schema.properties.lastName.default = this.props.history.location.state.data.data.data.lastName;
        schema.properties.email.default = this.props.history.location.state.data.data.data.email;
        schema.properties.phoneNumber.default = parseInt(this.props.history.location.state.data.data.data.phoneNumber);
        schema.properties.gender.default = this.props.history.location.state.data.data.data.genderConverted;

        // Bind
        this.onSubmitStepUpdate = this.onSubmitStepUpdate.bind(this);

    }

    componentDidMount(){

    }

    deleteUser(auiID){
        return postDeleteUserAPICALL(auiID)
            .then(isDelete => {
                return isDelete;
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
                        default:
                            console.log("Unrecognized type");
                    }
                }
            })
    }

    onSubmitStepUpdate = function({formData}, e) {
        let gender;

        (formData.gender==="Male")?gender=1:gender=0;

        return postUserUpdateAPICALL(this.props.history.location.state.data.data.data.hashedID, formData.firstName, formData.lastName, formData.email,formData.phoneNumber.toString(), gender)
            .then(isUpdated => {
                console.log(isUpdated);

                if(isUpdated){
                    // GLOBAL.HASHEDIDEVENTCREATED = hashedIDStepUpdated;
                    alert("User Updated Successfully");
                    //     this.forceUpdate();
                }else{
                    alert("An error has occurred while updating the user");
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

                    {/*View Participants*/}

                    <button className='btn btn-warning' onClick={()=>{
                        // this.getParticipantsData(this.props.history.location.state.data.data.data.peopleCompletedIDs, this.props.history.location.state.data.data.data.hashedIDEvent, this.props.history.location.state.data.data.data.hashedIDStep, "completions");
                        // this.props.history.push('/admin/view-participants', {ParticipantsReady: this.props.history.location.state.data.data.data.ParticipantsReady});
                        alert("Coming Soon");
                    }}>View Scan Privilege</button>


                    <button className='btn btn-warning' onClick={()=>{
                        // console.log("there");
                        // console.log(this.props.history.location.state.data.data.data.scanners);
                        // this.getParticipantsData(this.props.history.location.state.data.data.data.scanners, this.props.history.location.state.data.data.data.hashedIDEvent, this.props.history.location.state.data.data.data.hashedIDStep, "scanners");
                        alert("Coming Soon");
                    }}>View Joined Events</button>

                    <button className='btn btn-dark' onClick={()=>{
                        // this.props.history.push('/admin/step-statistics',{hashedIDEvent: this.props.history.location.state.data.data.data.hashedIDEvent, hashedIDStep: this.props.history.location.state.data.data.data.hashedIDStep});
                        alert("Coming Soon");
                    }}>Statistics</button>

                    <button style={{position: "absolute", right: 0}} className='btn btn-danger' onClick={()=>{
                        console.log(this.props.history.location.state.data.data.data.auiID);
                        let answer = window.prompt("Are you sure want to delete this User? Please enter the ID of the user:")

                        if(answer === this.props.history.location.state.data.data.data.auiID){
                            // console.log(this.props.history.location.state.eventID,props.original.hashedIDStep);
                            return this.deleteUser(this.props.history.location.state.data.data.data.auiID)
                                .then((isDeleted) => {
                                    if(isDeleted){
                                        alert("User deleted successfully");
                                    }
                                })
                        }else{
                            alert("The IDs don't match. Aborting...")
                        }
                        console.log(answer);
                    }}>Delete</button>

                </div>
            </div>
        )
    }
}


export default withRouter(UpdateUser);