import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import UserBar from './users/userbar';
import Offering from './dashboard/offering';
import AddEvent  from './dashboard/Event/addEvent';
import UpdateEvent from './dashboard/Event/updateEvent';
import UpdateStep from './dashboard/Step/updateStep';
import AddStep  from './dashboard/Step/addStep';
import columns from './dashboard/columns';
import ViewParticipants from './dashboard/Event/ViewParticipants';
import ViewFullyCompleted from './dashboard/Event/ViewFullyCompleted';
import ViewCompletions from './dashboard/Step/ViewCompletions';
import ViewScanners from './dashboard/Step/ViewScanners';
import UpdateUser from './dashboard/User/updateUser';
import EventStatistics from './dashboard/Event/eventStatistics';
import StepStatistics from './dashboard/Step/stepStatistics';
import Table from './dashboard/table';
import {verify} from './utils/requests'
import {getFromStorage} from './utils/storage'
import Statistics from "./views/statistics/statistics";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.2.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Admin extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data:[],
      auth: getFromStorage('auth')
    }
  }

  componentWillMount() {
  }

  render(){
    let {match} = this.props;
    return(
      <div>
        <UserBar />
        <div className="content">
          <Router>
            <div className='sidenav' style={{marginTop: "-30px"}}>
              <h2>Dashboard</h2>
              <aside>
                <Link to={`${match.url}/statistics`}> Statistics </Link>
                <Link to={`${match.url}/user`}> Users </Link>
                <Link to={`${match.url}/admins`}> Admins </Link>
                <Link to={`${match.url}/events`}> Events </Link>
                {/*<Link to={`${match.url}/steps`}> Steps</Link>*/}
              </aside>
            </div>

            <main style={{marginTop: "50px"}}>

              <Route
                path={`${match.path}/statistics`}
                component= {Statistics}
              />
              <Route
                path={`${match.path}/user`}
                component={
                  () => <Table
                          object='GET_USERS_DATA'
                          attribute='hashedID'
                          columns={columns.user} />
                }
              />
              <Route
                path={`${match.path}/admins`}
                component={
                  () => <Table
                          object='GET_ADMINS_DATA'
                          attribute='hashedID'
                          columns={columns.user} />
                }
              />
              <Route
                path={`${match.path}/events`}
                component={
                  () => <Table
                          object='GET_EVENTS_DATA'
                          attribute='hashedIDEvent'
                          columns={columns.event}
                          columnsSteps={columns.step}/>
                }
              />
              <Route
                path={`${match.path}/steps`}
                component={
                  () => <Table
                          object='GET_STEPS_DATA'
                          attribute='hashedIDStep'
                          columns={columns.step} />
                }
              />

              <Route
                  path={`${match.path}/add-event`}
                  component={
                    () => <AddEvent/>
                  }
              />
              <Route
                  path={`${match.path}/update-event`}
                  component={
                    () => <UpdateEvent/>
                  }
              />
            <Route
                path={`${match.path}/update-step`}
                component={
                    () => <UpdateStep/>
                }
            />
            <Route
                path={`${match.path}/update-user`}
                component={
                    () => <UpdateUser/>
                }
            />
            <Route
                path={`${match.path}/view-participants`}
                component={
                    () => <ViewParticipants/>
                }
            />
            <Route
                path={`${match.path}/view-completions`}
                component={
                    () => <ViewCompletions/>
                }
            />
            <Route
                path={`${match.path}/view-scanners`}
                component={
                    () => <ViewScanners/>
                }
            />
            <Route
                path={`${match.path}/view-fully-completed`}
                component={
                    () => <ViewFullyCompleted/>
                }
            />
            <Route
                path={`${match.path}/event-statistics`}
                component={
                    () => <EventStatistics/>
                }
            />
            <Route
                path={`${match.path}/step-statistics`}
                component={
                    () => <StepStatistics/>
                }
            />
            <Route
                    path={`${match.path}/add-step`}
                    component={
                      () => <AddStep/>
                }
              />
            </main>
          </Router>
        </div>
      </div>
    )
  }
}

export default Admin;
