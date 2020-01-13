import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import lang from '../utils/language';
import {
    getTableData,
    deleteTableData,
    getStepsListData,
    getEventFullData,
    getStepFullData,
    postDeleteStepAPICALL,
    postDeleteUserAPICALL,
    getUserFullData
} from '../utils/requests';
import {getLinkOptions} from '../utils/masks';
import {withRouter} from 'react-router'
// import columns from "./columns";




const COMMONLOCATIONS = ['Other','Main Gate','Enrollment Services','Admissions','The Center for Learning Excellence','Cafeteria','New Rest','Big Toms','Conference Center (Old Game Room)','Shop','Auditorium Building 4','Auditorium Building 7','Lab 7','Lab 11','Lab 8','Lab 8b','SSE Dean\'s Office','SBA Dean\'s Office','SHSS Dean\'s Office','Roman Theater','The Globe','Health Center','Building 17', 'President\'s Office',];

class Table extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      language: 'eng',
      object: this.props.object,
      attribute: this.props.attribute,
      columns: this.props.columns,
      columnsSteps: this.props.columnsSteps,
      show: true,
      data:[],
      shownData: [],
      stepData: [],
      manuals: []
    };

    this.getAndDisplayStepListData = this.getAndDisplayStepListData.bind(this);
  }

  getData() {
    console.log("Getting data..");
    var data = [];

    return getTableData(this.state.object)
        .then((res) => {
          console.log("Result getTableData:");
          console.log(res);
          data = res.data.data;
          if (this.state.data.length===0){
            this.setState({
              data: data
            })
          }

        })
        .then(() => {
          console.log("Returned Data: ");
          console.log(this.state.data);
          var shownData = JSON.parse(JSON.stringify(this.state.data));
          let isStep = this.isStep(shownData);

          for(let i=0; i < shownData.length; i++){
              shownData[i].date = this.timeConverter(shownData[i].date);
              //First we convert to timestamp then use the timeconverter function
              shownData[i].startDate = this.timeConverter(Date.parse(shownData[i].startDate));
              shownData[i].endDate = this.timeConverter(Date.parse(shownData[i].endDate));

              if(isStep){
                  if (shownData[i].commonLocation >= 0)
                    shownData[i].commonLocation = COMMONLOCATIONS[shownData[i].commonLocation];

                  if(!shownData[i].isMapped){
                    shownData[i].latitude = "-";
                    shownData[i].longitude = "-";
                    shownData[i].commonLocation = "-";
                  }
              }
          }
          this.setState({shownData});
          return this.getManuals();
        })
        .then((manuals) => {
          return this.fillData();
        })
  }

  getStepsData(eventHashedID) {
    console.log("Getting steps data..");
    var data = [];
    return getStepsListData("GET_EVENT_STEPS_LIST", eventHashedID)
        .then((res) => {
          console.log("Result getStepsListData:");
          data = res.data.data;

          console.log("Data: ");
          console.log(data);
          for(let i=0; i < data.length; i++){
              data[i].createdAt = this.timeConverter(data[i].createdAt);
              data[i].isMapped = this.booleanConverterYesNo(data[i].isMapped);
          }
          if (this.state.data.length===0){
            this.setState({
              data: data
            })
          }

        })
        .then(() => {
          console.log("Returned Data: ");
          console.log(this.state.data);
          var shownData = JSON.parse(JSON.stringify(this.state.data));
          let isStep = this.isStep(shownData);

          for(let i=0; i < shownData.length; i++){
            shownData[i].date = this.timeConverter(shownData[i].date);
            if(isStep){
              if (shownData[i].commonLocation >= 0)
                shownData[i].commonLocation = COMMONLOCATIONS[shownData[i].commonLocation];

              if(!shownData[i].isMapped){
                shownData[i].latitude = "-";
                shownData[i].longitude = "-";
                shownData[i].commonLocation = "-";
              }
            }

          }

          this.setState({shownData});
          return this.getManuals();
        })
        .then((manuals) => {
          return this.fillData();
        })
        .then(() => {
          console.log("Show Data:");
          console.log(this.state.data)
        })
  }


  getManuals(){
    let toChange = []
    let columns = this.state.columns;
    for (let idx in columns){
      let column = columns[idx];
      if (column.type==="link"){
        toChange.push(column);
      }
    }
    let manuals = []
    let manualsAdded=0;
    for (let idx1 in toChange){
      let change = toChange[idx1];
      return getLinkOptions(change)
      .then((res) => {
        manuals.push(res);
        manualsAdded++;
      })
      .then(() => {
        if(manualsAdded===toChange.length){
          this.setState({manuals: manuals});
        }
      })
    }
  }

  fillData(){
    var data = JSON.parse(JSON.stringify(this.state.data));
    var shownData = JSON.parse(JSON.stringify(data));
    let manuals = this.state.manuals;
    for (let idx in manuals){
      let manual = manuals[idx];
      for (let idx1 in manual){
        let entry = manual[idx1];
        for (let idx2 in data){
          if (data[idx2][entry.name]===entry.value){
            let name = entry.name;
            let label = entry.label;
            shownData[idx2][name] = label;
            this.setState({shownData})
          }
        }
      }
    }
  }

  fillStepListData(){
    var data = JSON.parse(JSON.stringify(this.state.data));
    var shownData = JSON.parse(JSON.stringify(data));
    let manuals = this.state.manuals;
    for (let idx in manuals){
      let manual = manuals[idx];
      for (let idx1 in manual){
        let entry = manual[idx1];
        for (let idx2 in data){
          if (data[idx2][entry.name]===entry.value){
            let name = entry.name;
            let label = entry.label;
            shownData[idx2][name] = label;
            this.setState({shownData})
          }
        }
      }
    }
  }


  deleteRow(value){
    var data = {};
    var body = {};
    data['object'] = this.state.object;
    data['attribute'] = this.state.attribute;
    data['value'] = value;
    body['data'] = data;
    deleteTableData(body)
    .then((res) => {
      window.location.reload();
    }).catch((err) => {
      console.error(err)
    });
  }

  valuesFromOriginal(original){
    var data = JSON.parse(JSON.stringify(this.state.data));
    let found = original;
    let id = original._id;
    for (let idx in data){
      let datum = data[idx];
      if(datum._id===id){
        found = datum;
      }
    }
    return found;
  }
    booleanConverterYesNo(value){
        return value?"Yes":"No";
    }

    timeConverter(UNIX_timestamp){
      let a = new Date(UNIX_timestamp * 1000);
      let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      let year = a.getFullYear();
      let month = months[a.getMonth()];
      let date = a.getDate();
      let hour = a.getHours();
      let min = a.getMinutes();
      let sec = a.getSeconds();
      let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }
    isStep(shownData){
        if(shownData[0] && shownData[0].stepTitle)
            return true;
        return false;
    }
  componentDidMount(){
    if(this.props.view){
      this.setState({show: false});
    }
    let thing = [];
    console.log(this.props.object);

    if(this.props.object === "GET_STEPS_DATA")
      this.getStepsData(this.props.location.state.eventID);
    else if(this.props.object === "GET_EVENTS_DATA")
        this.getData();
    else if(this.props.object === "GET_USERS_DATA")
        this.getData();
    else if(this.props.object === "GET_ADMINS_DATA")
        this.getData();
  }

  getAndDisplayStepListData(eventHashedID){

    console.log("Event hashedID: "+ eventHashedID);
    this.getStepsData(eventHashedID)
        .then(() => {

          var shownData = JSON.parse(JSON.stringify(this.state.stepData));
          let isStep = this.isStep(shownData);
            console.log("check here");
          console.log( shownData[0].createdAt);
          for(let i=0; i < shownData.length; i++){
            shownData[i].createdAt = this.timeConverter(shownData[i].createdAt);
            if(isStep){
              if (shownData[i].commonLocation >= 0)
                shownData[i].commonLocation = COMMONLOCATIONS[shownData[i].commonLocation];

              if(!shownData[i].isMapped){
                shownData[i].latitude = "-";
                shownData[i].longitude = "-";
                shownData[i].commonLocation = "-";
              }
            }

          }

          this.setState({stepData: shownData});
          return this.getManuals();
        })
        .then((manuals) => {
          return this.fillStepListData();
        })
  }

    deleteStep(hashedIDEvent, hashedIDStep){
        return postDeleteStepAPICALL(hashedIDEvent, hashedIDStep)
            .then(isDelete => {
                return isDelete;
            })
    }

    deleteUser(auiID){
        return postDeleteUserAPICALL(auiID)
            .then(isDelete => {
                return isDelete;
            })
    }
    
    

  render(){
    let more = (original) => {
      return null;
    }
    if(this.props.more){
      more = (original) => {
        let row = this.valuesFromOriginal(original);
        return (
          <button
                    className = 'btn btn-success'
                    onClick = {() => {
                      this.props.history.push(`offering/${row._id}/${row.service}/${original.service}/${row.classroom}`);
                    }}>
                More
          </button>
        )
      }
    }
    let columns = this.props.columns;

    columns = this.props.columns.concat([{
      Header: 'Action',
      Cell: props => {
        return(
          <div >
            {more(props.original)}
            {/*<button*/}
            {/*    style={{flex: 1}}*/}
            {/*className = 'btn btn-danger'*/}
            {/*onClick = {() => {*/}
            {/*  this.deleteRow(props.original[this.state.attribute])*/}
            {/*}}>*/}
            {/*Delete</button>*/}

              <button style={{flex: 1}} className='btn btn-primary' onClick={()=>{
                  if(this.props.object === "GET_EVENTS_DATA"){

                      return getEventFullData(props.original.hashedIDEvent)
                          .then(data => {
                              console.log(data);
                              // schema.properties.adminAUIID.default = "dfgh";
                              // schema.eventTitle = data.data.data.eventTitle;
                              console.log("HNA");
                              console.log(data);
                              let dataJSON = JSON.parse(JSON.stringify( data ));
                              dataJSON.data.data.createdAtConverted = this.timeConverter(Date.parse(dataJSON.data.data.createdAt));
                              dataJSON.data.data.updatedAtConverted = this.timeConverter(Date.parse(dataJSON.data.data.updatedAt));
                              dataJSON.data.data.startDateConverted = this.timeConverter(Date.parse(dataJSON.data.data.startDate));
                              dataJSON.data.data.endDateConverted = this.timeConverter(Date.parse(dataJSON.data.data.endDate));
                              this.props.history.push('/admin/update-event', {data: dataJSON});
                          })
                  }else if(this.props.object === "GET_STEPS_DATA"){
                      console.log("HASHEDIDEVENT:");
                      console.log(props);
                      //props.original.hashedIDStep
                      return getStepFullData(props.original.eventID, props.original.hashedIDStep)
                          .then(data => {
                              console.log(data);
                              // schema.properties.adminAUIID.default = "dfgh";
                              // schema.eventTitle = data.data.data.eventTitle;
                              console.log("HNA");
                              console.log(data);
                              let dataJSON = JSON.parse(JSON.stringify( data ));
                              dataJSON.data.data.createdAtConverted = this.timeConverter(Date.parse(dataJSON.data.data.createdAt));
                              dataJSON.data.data.updatedAtConverted = this.timeConverter(Date.parse(dataJSON.data.data.updatedAt));

                              this.props.history.push('/admin/update-step', {data: dataJSON});
                          })
                  }else if(this.props.object === "GET_USERS_DATA"){
                      console.log("HASHEDIDUSER:");
                      console.log(props.original.hashedID);
                      //props.original.hashedIDStep
                      return getUserFullData(props.original.hashedID)
                          .then(data => {
                              console.log(data);
                              // schema.properties.adminAUIID.default = "dfgh";
                              // schema.eventTitle = data.data.data.eventTitle;
                              console.log("HNA");
                              console.log(data);
                              let dataJSON = JSON.parse(JSON.stringify( data ));
                              dataJSON.data.data.createdAtConverted = this.timeConverter(Date.parse(dataJSON.data.data.createdAt));
                              dataJSON.data.data.updatedAtConverted = this.timeConverter(Date.parse(dataJSON.data.data.updatedAt));
                              (dataJSON.data.data.gender === 1)?dataJSON.data.data.genderConverted = "Male":dataJSON.data.data.genderConverted = "Female";

                              this.props.history.push('/admin/update-user', {data: dataJSON});
                          })
                  }
              }}> Update</button>

              {/*Old update (was surrounded by <Popup>)*/}
              {/*<div>*/}
              {/*  <div className="header"> <h2>Update {lang.objects[object][this.state.language]}</h2></div>*/}
              {/*  <div className="content">*/}
              {/*    <UpdateForm*/}
              {/*        object = {object}*/}
              {/*        columns = {this.props.columns}*/}
              {/*        values = {props.original}*/}
              {/*        attribute = {this.state.attribute}*/}
              {/*        value = {props.original[this.state.attribute]}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}


              {(this.props.object === "GET_EVENTS_DATA")
                  ?<button style={{flex: 1}} className='btn btn-success' onClick={()=>{
                      // this.props.history.push('/admin/steps',{data:this.getAndDisplayStepListData(props.original.hashedIDEvent)});
                      this.props.history.push('/admin/steps', {eventID: props.original.hashedIDEvent});
                  }}> View Steps</button>
                  :console.log("View Step Button Not Displayed")
              }

              {(this.props.object === "GET_STEPS_DATA" || this.props.object === "GET_USERS_DATA" || this.props.object === "GET_ADMINS_DATA")
                  ?<button style={{flex: 1}} className='btn btn-danger' onClick={()=>{
                      let answer
                      switch( this.props.object ){
                          case "GET_USERS_DATA": case "GET_ADMINS_DATA":
                              console.log(props.original.auiID);
                               answer = window.prompt("Are you sure want to delete this User? Please enter the ID of the user:")

                              if(answer === props.original.auiID){
                                  // console.log(this.props.history.location.state.eventID,props.original.hashedIDStep);
                                  return this.deleteUser(props.original.hashedID)
                                      .then((isDeleted) => {
                                          if(isDeleted){
                                              alert("User deleted successfully");
                                          }
                                      })
                              }else{
                                  alert("The IDs don't match. Aborting...")
                              }
                              console.log(answer);
                              break;
                          case "GET_STEPS_DATA":
                              console.log(props.original.stepTitle);
                               answer = window.prompt("Are you sure want to delete this Step? Please enter the title of the step:")

                              if(answer === props.original.stepTitle){
                                  // console.log(this.props.history.location.state.eventID,props.original.hashedIDStep);
                                  return this.deleteStep(this.props.history.location.state.eventID,props.original.hashedIDStep)
                                      .then((isDeleted) => {
                                          if(isDeleted){
                                              alert("Step deleted successfully");
                                          }
                                      })
                              }else{
                                  alert("The titles don't match. Aborting...")
                              }
                              console.log(answer);
                              break;
                          default: console.log("Unrecognized type");
                      }

                  }}> Delete</button>
                  :console.log("Delete Step Button Not Displayed")
              }


          </div>
        )
      },
      show: this.state.show,
      filterable: false,
      width: 280
    }]
  );


    const object = this.state.object;
    const language = this.state.language;
    return(
      <div>
        <h2 className='title'>{lang.objects[object][language]} Table</h2>
        <button className='btn btn-outline-success' onClick={()=>{
        this.props.history.push('add-event');
    }}> New {lang.objects[object][language]}</button>
        

        <ReactTable
          data = {this.state.shownData}
          columns = {columns}
          filterable = {true}
         />
       </div>
    )
  }
}

export default withRouter(Table);
