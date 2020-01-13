import React from 'react';
import ReactTable from "react-table";
import {getTableData, deleteTableData} from '../utils/requests';
import {getLinkOptions, convertInfo} from '../utils/masks';
import {withRouter} from 'react-router'
import PopupButton  from './popup'

class List extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],
      shownData: [],
      links: []
    }
  }

  deleteRow(value){
    var data = {};
    var body = {};
    data['object'] = this.props.object;
    data['attribute'] = '_id';
    data['value'] = value;
    body['data'] = data;
    deleteTableData(body)
    .then((res) => {
      window.location.reload();
    }).catch((err) => {
      console.error(err)
    });
  }

  getData() {
    console.log("Getting data..");
    var data = [];
    return getTableData(this.props.object,this.props.fixed)
    .then((res) => {
       data = res.data.result;
       this.setState({
         data: data
       })
     });
  }

  getOptions(object,rows){
    let link = {
      object: object,
      attribute: '_id',
      shown: ['lastName','firstName'],
      rows: rows
    }
    let newState = this.state;
    newState.links.push(link);
    this.setState(newState);
    return convertInfo(link);
  }

  makeShownData(pairs){
    let data  = JSON.parse(JSON.stringify(this.state.data));
    let shownData = JSON.parse(JSON.stringify(data));
    let links = JSON.parse(JSON.stringify(this.state.links));
    for (let link of links){
      let object = link.object;
      for (let datum of data){
        datum[object] = pairs[datum[object]]
      }
    }
    this.setState({shownData: data})
  }

  componentDidMount(){

    this.getData()
    .then(() => {
      let rows = this.state.data.map(row => row[this.props.link]);
      return this.getOptions(this.props.link,rows);
    })
    .then((pairs) => {
      this.makeShownData(pairs);
    })
  }



  render(){
    let object = this.props.object;
    let columns = this.props.columns.concat([{
      Header: 'Action',
      Cell: props => {
        return(
          <div>
            <button
            className = 'btn btn-danger'
            onClick = {() => {
              this.deleteRow(props.original._id)
            }}>
            Delete</button>
          </div>
        )
      },
      show: this.state.show,
      filterable: false,
      width: 100
    }]);
    return(
      <div>
        <PopupButton
          name = {this.props.title}
          object = {this.props.object}
          columns = {columns}
          fixed = {this.props.fixed}
          />
        <ReactTable
          data = {this.state.shownData}
          columns = {columns}
          filterable = {true}
         />
       </div>
    )
  }
}

export default withRouter(List);
