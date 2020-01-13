import axios from 'axios';
import {getFromStorage} from './storage';
import GLOBAL from './global';


// const domain = 'http://fye-em.aui.ma/';
const domain = 'http://fye-em.aui.ma/';
const admin = 'http://localhost:8080/admin/';
const users = 'http://localhost:8080/users/';

const requests = {
    "GET_USERS_DATA" : domain + ":hashedID/users",
    "GET_ADMINS_DATA" : domain + ":hashedID/admins",
    "GET_EVENTS_DATA" : domain + ":hashedID/events",
    "GET_STEPS_DATA" : domain + ":hashedID/steps",
    "POST_SIGNOUT" : domain + "signout",
    "GET_STATISTICS_DATA": domain + ":hashedID/statistics",
    "GET_EVENT_STATISTICS_DATA": domain + ":hashedID/events/:eventHashedID/event-statistics",
    "GET_STEP_STATISTICS_DATA": domain + ":hashedID/events/:eventHashedID/steps/:stepHashedID/step-statistics",
    "POST_CREATE_EVENT": domain + "events/:hashedID/events/create",
    "POST_CREATE_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/create",
    "POST_SET_LOCATION_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/:stepHashedID/addLocation",
    "POST_SET_LOCATION_EVENT": domain + "events/:hashedID/events/:eventHashedID/add-location",
    "POST_SET_TIME_EVENT": domain + "events/:hashedID/events/:eventHashedID/add-date-time",
    "GET_EVENT_STEPS_LIST": domain + "steps/:hashedID/events/:eventHashedID/steps/data",
    "GET_EVENT_FULL_DATA": domain + "events/:hashedID/event/:eventHashedID/full-data",
    "GET_USER_FULL_DATA": domain + "accounts/:hashedID/user/data",
    "GET_STEP_FULL_DATA": domain + "steps/:hashedID/event/:eventHashedID/step/:stepHashedID/full-data",
    "POST_UPDATE_USER": domain + "accounts/:hashedID/users/:userHashedID/update",
    "POST_UPDATE_EVENT": domain + "events/:hashedID/events/:eventHashedID/update",
    "POST_UPDATE_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/:stepHashedID/update",
    "POST_DELETE_EVENT": domain + "events/:hashedID/events/:eventHashedID/delete",
    "POST_DELETE_USER": domain + "accounts/:hashedID/users/:userHashedID/delete",
    "POST_DELETE_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/:stepHashedID/delete",
    "GET_USERS_PARTICIPANTS_DATA": domain + "accounts/:hashedID/users/data",
    "POST_REMOVE_USER_FROM_PARTICIPANTS": domain + "events/:hashedID/event/:eventHashedID/remove/participant",
    "POST_REMOVE_USER_FROM_FULLY_COMPLETED": domain + "events/:hashedID/event/:eventHashedID/remove/fully-completed",
    "POST_REMOVE_USER_FROM_COMPLETION_OF_STEP": domain + "steps/:hashedID/event/:eventHashedID/step/:stepHashedID/remove/completed",
    "POST_REMOVE_USER_FROM_SCANNER_OF_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/:stepHashedID/privilege/scanner/remove",
    "POST_ADD_USER_TO_PARTICIPANTS": domain + "events/admin/:hashedID/event/:eventHashedID/join",
    "POST_ADD_USER_TO_COMPLETION_OF_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/:stepHashedID/user/aui/:auiID/complete",
    "POST_ADD_USER_TO_SCANNER_OF_STEP": domain + "steps/:hashedID/events/:eventHashedID/steps/:stepHashedID/privilege/scanner/:hashedIDScanner",
    "POST_ADD_USER_TO_FULLY_COMPLETED": domain + "events/admin/:hashedID/event/:eventHashedID/leave",
};

function verify(token) {
  return axios.get(users+'verify',{
    params:{
      token: token
    }
  })
}
function postStepLocationUpdateAPICALL(eventID, stepID, lat, long, commonLocation){
    let URL_READY = requests["POST_SET_LOCATION_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    URL_READY = URL_READY.replace(":stepHashedID",stepID);
    return axios.post(URL_READY,{
        latitude: lat,
        longitude: long,
        commonLocation: commonLocation
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            console.log(res);
            return true;

        }).catch((err) => {
            console.error(err)
            return false;
        });
}
function postEventLocationUpdateAPICALL(eventID, lat, long, commonLocation){
    let URL_READY = requests["POST_SET_LOCATION_EVENT"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    return axios.post(URL_READY,{
        latitude: lat,
        longitude: long,
        commonLocation: commonLocation
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            console.log(res);
            return true;

        }).catch((err) => {
            console.error(err);
            return false;
        });
}
function postEventDateTimeUpdateAPICALL(eventID, start, end){

    console.log("eventID:")
    console.log(eventID);
    let URL_READY = requests["POST_SET_TIME_EVENT"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    console.log(URL_READY);
    console.log(start);
    console.log(end);
    return axios.post(URL_READY,{
        startDate: start,
        endDate: end
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            console.log(res);
            return true;

        }).catch((err) => {
            console.error(err);
            return false;
        });
}
function getStatisticsDataAPICALL(){
     let URL_READY = requests["GET_STATISTICS_DATA"].replace(":hashedID",GLOBAL.HASHEDID);
  return axios.get(URL_READY,{
    headers: {
      auth: GLOBAL.AUTH
    },
     params:{
     }
   })
}
function getEventStatisticsDataAPICALL(eventID){
    let URL_READY = requests["GET_EVENT_STATISTICS_DATA"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);

    console.log(URL_READY);
    return axios.get(URL_READY,{
        headers: {
            auth: GLOBAL.AUTH
        },
        params:{
        }
    })
}
function getStepStatisticsDataAPICALL(eventID, stepID){
    let URL_READY = requests["GET_STEP_STATISTICS_DATA"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    URL_READY = URL_READY.replace(":stepHashedID",stepID);

    console.log(URL_READY);
    return axios.get(URL_READY,{
        headers: {
            auth: GLOBAL.AUTH
        },
        params:{
        }
    })
}
function postStepCreationAPICALL(eventID, stepTitle, stepDescription){
    let URL_READY = requests["POST_CREATE_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    console.log(URL_READY);
    console.log(eventID);
    console.log(stepTitle);
    console.log(stepDescription);
    return axios.post(URL_READY,{
        stepTitle: stepTitle,
        stepDescription: stepDescription
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            return {eventID: res.data.data.hashedIDEvent, stepID: res.data.data.hashedIDStep};

        }).catch((err) => {
            console.error(err)
        });
}
function getUserFullData(hashedIDUser){
    let URL_READY = requests["GET_USER_FULL_DATA"].replace(":hashedID",GLOBAL.HASHEDID);

    console.log(URL_READY);
    return axios.post(URL_READY
        ,{
            IDs: hashedIDUser
        },{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function getEventFullData(eventID){
    let URL_READY = requests["GET_EVENT_FULL_DATA"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    console.log(URL_READY);
    return axios.get(URL_READY
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function getStepFullData(eventID, stepID){
    let URL_READY = requests["GET_STEP_FULL_DATA"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    URL_READY = URL_READY.replace(":stepHashedID",stepID);

    console.log(URL_READY);
    return axios.get(URL_READY
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function getParticipantsDataAPICall(usersIDs){
    let URL_READY = requests["GET_USERS_PARTICIPANTS_DATA"].replace(":hashedID",GLOBAL.HASHEDID);
    console.log(URL_READY);
    console.log("usersIDs");
    console.log(usersIDs);
    let dataJSON = JSON.parse(JSON.stringify( usersIDs ));
    return axios.post(URL_READY,{
            IDs: dataJSON
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data);
            return res.data;

        }).catch((err) => {
            console.error(err)
        });
}
function postEventCreationAPICALL(eventTitle, eventDescription, maxParticipants, isOrdered, organizer){
     let URL_READY = requests["POST_CREATE_EVENT"].replace(":hashedID",GLOBAL.HASHEDID);
    // console.log(URL_READY);
    // console.log("adminID:"+ GLOBAL.HASHEDID + "," +
    //     "eventTitle:" + eventTitle + "," +
    //     "eventDescription:" + eventDescription + "," +
    //     "maxParticipants:" + maxParticipants + "," +
    //     "isOrdered:" + isOrdered + "," +
    //     "organizer:" +  organizer)
    return axios.post(URL_READY,{
            adminID: GLOBAL.HASHEDID,
            eventTitle: eventTitle,
            eventDescription: eventDescription,
            maxParticipants: maxParticipants,
            isOrdered: isOrdered,
            organizer: organizer
   },{headers: {
     auth: GLOBAL.AUTH
   }})
    .then((res) => {
        console.log(res);
        GLOBAL.EVENTTITLE = res.data.data.eventTitleCreated;
        return res.data.data.hashedIDEventCreated;
        
    }).catch((err) => {
      console.error(err)
    });
}
function postUserUpdateAPICALL(userHashedID, firstName, lastName, email, phoneNumber, gender){
    let URL_READY = requests["POST_UPDATE_USER"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":userHashedID",userHashedID);
    console.log(URL_READY);
    console.log("firstName:" +firstName+
        "lastName:" +lastName+
        "email:" +email+
        "phoneNumber:" +phoneNumber+
        "gender:" +gender);
    return axios.post(URL_READY,{
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            console.log("RESULT HERE:");
            console.log(res);

            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postEventUpdateAPICALL(eventHashedID, adminAUIID, eventTitle, eventDescription, maxParticipants, organizer){
    let URL_READY = requests["POST_UPDATE_EVENT"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventHashedID);
    console.log(URL_READY);

    return axios.post(URL_READY,{
        adminAUIID: adminAUIID,
        eventTitle: eventTitle,
        eventDescription: eventDescription,
        maxParticipants: maxParticipants,
        organizer: organizer
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            console.log("RESULT HERE:");
            console.log(res);
            GLOBAL.EVENTTITLE = res.data.data.eventTitleUpdated;
            return res.data.data.hashedIDEventUpdated;

        }).catch((err) => {
            console.error(err)
        });
}
function postStepUpdateAPICALL(eventHashedID, stepHashedID, stepTitle, stepDescription){
    let URL_READY = requests["POST_UPDATE_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID", eventHashedID);
    URL_READY = URL_READY.replace(":stepHashedID", stepHashedID);
    console.log(URL_READY);

    return axios.post(URL_READY,{
        stepTitle: stepTitle,
        stepDescription: stepDescription,
    },{headers: {
            auth: GLOBAL.AUTH
        }})
        .then((res) => {
            console.log("RESULT HERE:");
            console.log(res);
            return res.data.data.hashedIDStepUpdated;

        }).catch((err) => {
            console.error(err)
        });
}
function postRemoveUserFromParticipantsAPICALL(hashedIDEvent, hashedID){
    let URL_READY = requests["POST_REMOVE_USER_FROM_PARTICIPANTS"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    console.log(URL_READY);
    return axios.post(URL_READY,{
            hashedID: hashedID
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data.status);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postRemoveUserFromCompletionOfStepAPICALL(hashedIDEvent, hashedIDStep, hashedID){
    let URL_READY = requests["POST_REMOVE_USER_FROM_COMPLETION_OF_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    URL_READY = URL_READY.replace(":stepHashedID",hashedIDStep);
    console.log(URL_READY);
    return axios.post(URL_READY,{
            hashedID: hashedID
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data.status);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postRemoveUserFromScannerOfStepAPICALL(hashedIDEvent, hashedIDStep, hashedID){
    let URL_READY = requests["POST_REMOVE_USER_FROM_SCANNER_OF_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    URL_READY = URL_READY.replace(":stepHashedID",hashedIDStep);
    console.log(URL_READY);
    return axios.post(URL_READY,{
            hashedID: hashedID
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data.status);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postRemoveUserFromFullyCompletedAPICALL(hashedIDEvent, hashedID){
    let URL_READY = requests["POST_REMOVE_USER_FROM_FULLY_COMPLETED"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    console.log(URL_READY);
    return axios.post(URL_READY,{
            hashedID: hashedID
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data.status);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postAddUserToParticipantsOfEventAPICALL(hashedIDEvent, auiID){
    let URL_READY = requests["POST_ADD_USER_TO_PARTICIPANTS"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    console.log("auiID: " + auiID);
    console.log(URL_READY);
    return axios.post(URL_READY,{
            auiID: auiID
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data.status);
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function postAddUserToCompletionOfStepAPICALL(hashedIDEvent, hashedIDStep, auiID){
    let URL_READY = requests["POST_ADD_USER_TO_COMPLETION_OF_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    URL_READY = URL_READY.replace(":stepHashedID",hashedIDStep);
    URL_READY = URL_READY.replace(":auiID",auiID);

    console.log("auiID: " + auiID);
    console.log(URL_READY);
    return axios.get(URL_READY,{
        headers: {
            auth: GLOBAL.AUTH
        },
        params:{
        }})
        .then((res) => {
            console.log(res.data.status);
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function postAddUserToScannerOfStepAPICALL(hashedIDEvent, hashedIDStep, auiID){
    let URL_READY = requests["POST_ADD_USER_TO_SCANNER_OF_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    URL_READY = URL_READY.replace(":stepHashedID",hashedIDStep);
    URL_READY = URL_READY.replace(":hashedIDScanner",auiID);

    console.log("auiID: " + auiID);
    console.log(URL_READY);
    return axios.get(URL_READY,{
        headers: {
            auth: GLOBAL.AUTH
        },
        params:{
        }})
        .then((res) => {
            console.log(res.data.status);
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function postAddUserToFullyCompletedOfEventAPICALL(hashedIDEvent, auiID){
    let URL_READY = requests["POST_ADD_USER_TO_FULLY_COMPLETED"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",hashedIDEvent);
    console.log("auiID: " + auiID);
    console.log(URL_READY);
    return axios.post(URL_READY,{
            auiID: auiID
        }
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res.data.status);
            return res;

        }).catch((err) => {
            console.error(err)
        });
}
function postDeleteEventAPICALL(eventID){
    let URL_READY = requests["POST_DELETE_EVENT"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    console.log(URL_READY);
    return axios.post(URL_READY,{}
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postDeleteUserAPICALL(auiID){
    let URL_READY = requests["POST_DELETE_USER"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":userHashedID",auiID);
    console.log(URL_READY);
    return axios.post(URL_READY,{}
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}
function postDeleteStepAPICALL(eventID, stepID){
    let URL_READY = requests["POST_DELETE_STEP"].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventID);
    URL_READY = URL_READY.replace(":stepHashedID",stepID);

    console.log(URL_READY);
    return axios.post(URL_READY,{}
        ,{headers: {
                auth: GLOBAL.AUTH
            }})
        .then((res) => {
            console.log(res);
            return (res.data.status==="success")?true:false;

        }).catch((err) => {
            console.error(err)
        });
}

function getTableData(object,find){
    let URL_READY = requests[object].replace(":hashedID",GLOBAL.HASHEDID);
    console.log(URL_READY);
    return axios.get(URL_READY,{
        headers: {
            auth: GLOBAL.AUTH
        },
        params:{
        }
    })
}

function getStepsListData(object,eventHashedID){
    let URL_READY = requests[object].replace(":hashedID",GLOBAL.HASHEDID);
    URL_READY = URL_READY.replace(":eventHashedID",eventHashedID);
    return axios.get(URL_READY,{
        headers: {
            auth: GLOBAL.AUTH
        },
        params:{
        }
    })
}

function postTableData(object, values){
   return axios.post(admin+'table',{
     test: 'test',
     object: object,
     data: values
   },{headers: {
     auth: GLOBAL.AUTH
   }})
 }

function updateTableData(object,attribute,value,values){
   return axios.put(admin+'table',{
       object: object,
       attribute: attribute,
       value: value,
       data: values
   },{
      headers: {
        token: getFromStorage("token")
      }
    }
  )
}

function deleteTableData(body){
  console.log('calling delete');
  return axios.delete(admin+'table',Object.assign(
    body,
    {
      headers: {
        token: getFromStorage("token")
      }
    }
  ))
}

function getUser(){
  return axios.get(users+'current',{
    params: {
      token: getFromStorage("token")
    }
  })
}

function logout(){
  return axios.post(requests.POST_SIGNOUT,{},
    {
      headers: {
        auth: GLOBAL.AUTH
   }});

}

export {verify, getTableData, postTableData, getStepsListData, updateTableData, deleteTableData, getUser, getEventStatisticsDataAPICALL, getStatisticsDataAPICALL, postEventCreationAPICALL, postStepCreationAPICALL,postStepLocationUpdateAPICALL, postEventLocationUpdateAPICALL, postEventDateTimeUpdateAPICALL, postDeleteEventAPICALL, getEventFullData, postEventUpdateAPICALL, getParticipantsDataAPICall, postRemoveUserFromParticipantsAPICALL, postAddUserToParticipantsOfEventAPICALL, postRemoveUserFromFullyCompletedAPICALL, postAddUserToFullyCompletedOfEventAPICALL, postDeleteStepAPICALL, getStepFullData, postStepUpdateAPICALL, postDeleteUserAPICALL, postAddUserToCompletionOfStepAPICALL, postRemoveUserFromCompletionOfStepAPICALL, postAddUserToScannerOfStepAPICALL, postRemoveUserFromScannerOfStepAPICALL, getStepStatisticsDataAPICALL, getUserFullData, postUserUpdateAPICALL, logout}
