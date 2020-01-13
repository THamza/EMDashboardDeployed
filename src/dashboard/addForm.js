import React from 'react';
import Select from 'react-select'
import lang from '../utils/language'
import {postTableData, getTableData} from '../utils/requests';

const language = 'eng';

class AddForm extends React.Component {
  // setting the state in order to handle change in form values
  constructor(props) {
    super(props);
    // this variable will hold the names of all accessors sent as props
    let accessors = [];
    // this variable will be used to hold the values entered by the user in the form
    let values = {};
    let options = {};
    // going through the columns and preparing the variables that will be used later
    for (const idx in this.props.columns){
      const column = this.props.columns[idx];
      const accessor = column.accessor;
      accessors.push(accessor);
      values[accessor] = '';
      if(column.type==='fixed'){
        values[accessor] = this.props.fixed[accessor];
      }
      if(column.type==='link'){
        this.getLinkOptions(column)
        .then((values) => {
          this.setState({loading: true});
          options[accessor] = values;
          this.setState({loading:false});
        })
      }
    }


    this.state = {
      error: '',
      values: values,
      loading: false,
      options: options
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var newState = this.state;
    if(event.target){
      newState.values[event.target.name] = event.target.value;
    }else{
      newState.values[event.name] = event.value;
    }
    this.setState(newState);
  }

  handleSubmit(event) {
      event.preventDefault();
      console.log("values");
      console.log(this.state.values);
      postTableData(this.props.object,this.state.values)
      .then((res) => {
        let {data} = res;
        if(data.success){
          this.setState({error: ""});
          window.location.reload();
        }else{
          this.setState({error:data.message});
        }
      }).catch((err) => {
        console.error(err)
      });
    }

    getLinkOptions(column){
      let link = column.link;
      return getTableData(link.object)
      .then((res) => {
        if(res.data.success){
          let values = [];
          for (const idx in res.data.result){
            let element = res.data.result[idx];
            let id = element[link.attribute];
            let shown = '';
            for (const idx1 in link.shown){
              shown+= element[link.shown[idx1]] + ' ';
            }
            let value = {value: id, label: shown, name: column.accessor}
            values.push(value);
          }
          return values;
        }
        else{
          return console.log(res.data.message)
        }
      })
      .catch((err) => {
        return console.error(err);
      })
    }

    getLabel(accessor){
      console.log(accessor);
      let options = this.state.options[accessor];
      let value = this.state.values[accessor];
      for (let idx in options){
        let option = options[idx];
        console.log(option);
        if(option.value===value){
          return option.label;
        }
      }
      return value;
    }


  render(){
    // we use the props to create the form content here as we can't use loops inside the return
    var formContent = [];
    var temp = null;
    // looping through all the props and extracting the needed data
    for (var idx in this.props.columns){
      const column = this.props.columns[idx];
      if(!column.accessor){
        continue;
      }
      if(column.type==='fixed'){
        continue;
      }
      switch(column.type){
        case 'link':
          let options = this.state.options[column.accessor];
          temp = <label name={column.accessor}  className = "form-group">
                    {column.Header}:<br/>
                    <Select
                      className='select'
                      onChange={this.handleChange}
                      options={options}
                      key={column.accessor}
                      value={
                        this.state.values[column.accessor] &&
                        {
                          label: this.getLabel(column.accessor),
                          value: this.state.values[column.accessor]
                        }
                      }
                      placeholder={lang.prompts.select[language]}
                    />
                  </label>;
                break;
        case 'dropdown':
          temp = <label name={column.accessor}  className = "form-group">
                    {column.Header}:<br/>
                    <Select
                      className='select'
                      onChange={this.handleChange}
                      options={column.options}
                      key={column.accessor}
                      value={
                        this.state.values[column.accessor] &&
                        {
                          label: this.state.values[column.accessor],
                          value: this.state.values[column.accessor]
                        }
                      }
                      placeholder={lang.prompts.select[language]}
                    />
                  </label>;
          break;
        case 'textarea':
          temp = <label className = "form-group">
                    {column.Header}:<br/>
                    <textarea className="form-control" type="text"
                    rows={column.rows}
                    cols={column.cols}
                    name={column.accessor}
                    key={column.accessor}
                    value={this.state.values[column.accessor]}
                    onChange={this.handleChange}></textarea>
                  </label>;
          break;
        default:
          if (column.visible!==false){
            temp =   <label >
                        {column.Header}:<br/>
                        <input type="text" className="form-control"
                          name={column.accessor}
                          key={column.accessor}
                          value={this.state.values[column.accessor]}
                          onChange={this.handleChange}/>
                      </label>;
            }
        }

      formContent.push(<div key={column.accessor+'div'} className = "form-group">{temp}</div>);
    }
    if(this.state.loading){return null}
    return(
      <div>
        <p className = 'error'>{this.state.error}</p>
        <form onSubmit={this.handleSubmit}>
          {formContent}
          <input className='btn btn-primary' type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default AddForm;
