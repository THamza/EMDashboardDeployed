import {getTableData} from './requests';

function getLinkOptions(column){
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


function convertInfo(link){
  let {object, attribute, shown, rows} = link;
  // let object = 'beneficiary';
  // let attribute = '_id';
  // let shown = ['lastName','firstName']
  // let rows = ['5c9a027ad81d90273713e3b4','5c9a5da496f511138b3dfbfc']
  console.log(link);
  let result = {};
  return getTableData(object)
  .then((res) => {
    let data = res.data.result;
    for (let datum of data){
      if(rows.includes(datum[attribute])){
        let toShow = '';
        for (let shownAttribute of shown){
          toShow+= datum[shownAttribute]+' '
        }
        result[datum[attribute]] = toShow;
      }
    }
    console.log(result);
    return result;
  })
}

export {getLinkOptions, convertInfo};
