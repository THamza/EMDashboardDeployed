import lang from '../utils/language'

const language = 'eng';
// const gender = lang.menus.gender[language];

export default  {
    user: [{
    Header: 'AUI ID',
    accessor: 'auiID'
  },{
    Header: 'First Name',
    accessor: 'firstName'
  },{
    Header: 'Last Name',
    accessor: 'lastName'
  },{
    Header: 'Email Address',
    accessor: 'email',
  },{
    Header: 'Phone Number',
    accessor: 'phoneNumber',
  },{
    Header: 'Date Created',
    accessor: 'date'
  },{
    show: false,
    Header: 'Country',
    accessor: 'country'
  },{
    show: false,
    Header: 'Gender',
    accessor: 'gender'
  },{
    show: false,
    Header: 'Password',
    accessor: 'password'
  },{
    show: false,
    Header: 'Password Confirmation',
    accessor: 'confirmPassword'
  },],
    
    
    event: [{
    Header: 'Title',
    accessor: 'eventTitle'
  },{
    Header: 'Description',
    accessor: 'eventDescription'
  },{
    Header: 'Organizer',
    accessor: 'organizer'
  },{
    Header: 'Number of Participants',
    accessor: 'numberOfParticipants',
  },{
    Header: 'Max. Participants',
    accessor: 'maxParticipants'
  },{
    show: false,
    Header: 'Event ID',
    accessor: 'hashedIDEvent'
  },{
    show: false,
    Header: 'Participants IDs',
    accessor: 'participantsIDs',
  },{
    show: false,
    Header: 'Steps IDs',
    accessor: 'stepsIDs'
  },{
    Header: 'Start Date',
    accessor: 'startDate'
  },{
    Header: 'End Date',
    accessor: 'endDate'
  },{
    Header: 'Date of Creation',
    accessor: 'date'
  }],
    
    
    step: [{
    show: false,
    Header: 'Event ID',
    accessor: 'eventID'
  },{
    Header: 'Title',
    accessor: 'stepTitle'
  },{
    Header: 'Description',
    accessor: 'stepDescription',
  },{
    show: false,
    Header: 'Step ID',
    accessor: 'hashedIDStep'
  },{
    Header: 'Number of Completions',
    accessor: 'numberOfPeopleCompleted'
  },{
    Header: 'Is Mapped',
    accessor: 'isMapped'
  },{
    Header: 'Location',
    accessor: 'commonLocation'
  },{
    Header: 'Date of Creation',
    accessor: 'createdAt'
  }],
    
  
}
