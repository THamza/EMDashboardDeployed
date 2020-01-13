const gender = [
  {value: 'Male', label: 'Male', name:'gender'},
  {value: 'Female', label: 'Female', name:'gender'},
  {value: 'Other', label: 'Other', name:'gender'}
]
module.exports = {
  objects: {
      GET_USERS_DATA:{
      var: 'GET_USERS_DATA',
      eng: 'User',
      ar: ''
    },
      GET_ADMINS_DATA:{
      var: 'GET_ADMINS_DATA',
      eng: 'Admins',
      ar: ''
    },
    GET_EVENTS_DATA:{
      var: 'GET_EVENTS_DATA',
      eng: 'Events',
      ar: ''
    },
    GET_STEPS_DATA:{
      var: 'GET_STEPS_DATA',
      eng: 'Step',
      ar: ''
    },
    employee:{
      var: 'employee',
      eng: 'Employee',
      ar: ''
    },
    
  },
  menus: {
    gender: {
      eng: gender
    }
  },
  prompts:{
    select: {
      eng: 'Please select',
      ar: ''
    }
  }
}
