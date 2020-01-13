import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Container, Row, Col } from "react-bootstrap";
import {getEventStatisticsDataAPICALL} from '../../utils/requests';

import {withRouter} from 'react-router-dom';

import { Card } from "../../components/Card/Card.jsx";
import { StatsCard } from "../../components/StatsCard/StatsCard.jsx";

import '@fortawesome/fontawesome-free/css/all.min.css';

let dataPieAccountScannersRatio = {
    labels: [],
    series: []
};
let legendPieAccountScannersRatio = {
    names: ["Scanners", "Users"],
    types: ["info", "danger"]
};

let dataPieAccountFullyCompletedRatio = {
    labels: [],
    series: []
};
let legendPieAccountFullyCompletedRatio = {
    names: ["Participants", "Fully Completed"],
    types: ["info", "danger"]
};

let dataPieAccountParticipantsRatio = {
    labels: [],
    series: []
};
let legendPieAccountParticipantsRatio = {
    names: ["Participants", "Users"],
    types: ["info", "danger"]
};

var dataStepCompletionTraffic = {
  labels: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ],
  series: [
    [],
  ]
};
var optionsStepCompletionTraffic = {
  low: 0,
  high: 1000,
  showArea: false,
  height: "245px",
  axisX: {
    showGrid: false
  },
  lineSmooth: true,
  showLine: true,
  showPoint: true,
  fullWidth: true,
  chartPadding: {
    right: 50
  }
};
var responsiveStepCompletionTraffic = [
  [
    "screen and (max-width: 640px)",
    {
      axisX: {
        labelInterpolationFnc: function(value) {
          return value[0];
        }
      }
    }
  ]
];
var legendStepCompletionTraffic = {
  names: ["Completions "],
  types: ["info"]
};

class eventStatistics extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
    constructor(props){
        super(props);
        this.state = {
            hashedIDEvent: this.props.history.location.state.hashedIDEvent,
            numberOfUsers : 0,
            numberOfParticipants: 0,
            numberOfFullyCompleted: 0,
            numberOfSteps: 0,
            numberOfScanners: 0,
            stepTitles: [],
            stepsCompletion: []

        }

        this.getData = this.getData.bind(this);

    }

    componentDidMount(){

        this.getData(this.state.hashedIDEvent);
        this.interval = setInterval(() => this.getData(this.state.hashedIDEvent), 3000);
    }
    
    getData(hashedIDEvent){
         console.log("Getting data..");
        let data = [];
        return getEventStatisticsDataAPICALL(hashedIDEvent)
        .then((res) => {
           data = res.data.data;

             this.setState({
                 numberOfUsers: data.numberOfUsers,
                 numberOfParticipants: data.numberOfParticipants,
                 numberOfFullyCompleted: data.numberOfFullyCompleted,
                 numberOfScanners: data.numberOfScanners,
                 numberOfSteps: data.numberOfSteps,
                 stepTitles: data.stepTitles,
                 stepsCompletion: data.stepsCompletion
             });

             // Pie Data Scanners vs Users
            dataPieAccountScannersRatio.series = [data.numberOfScanners, data.numberOfUsers-data.numberOfScanners] ;
            dataPieAccountScannersRatio.labels = [(parseInt((data.numberOfScanners*100)/data.numberOfUsers)).toString()+"%", (parseInt((data.numberOfUsers-data.numberOfScanners)*100/data.numberOfUsers)).toString()+"%"];

            // Pie Data Participants vs Fully Complted
            dataPieAccountFullyCompletedRatio.series = [data.numberOfFullyCompleted, data.numberOfParticipants-data.numberOfFullyCompleted] ;
            dataPieAccountFullyCompletedRatio.labels = [(parseInt((data.numberOfFullyCompleted*100)/data.numberOfParticipants)).toString()+"%", (parseInt((data.numberOfParticipants-data.numberOfFullyCompleted)*100/data.numberOfParticipants)).toString()+"%"];

            // Pie Data Participants vs users
            dataPieAccountParticipantsRatio.series = [data.numberOfParticipants, data.numberOfUsers-data.numberOfParticipants] ;
            dataPieAccountParticipantsRatio.labels = [(parseInt((data.numberOfParticipants*100)/data.numberOfUsers)).toString()+"%", (parseInt((data.numberOfUsers-data.numberOfParticipants)*100/data.numberOfUsers)).toString()+"%"];

// //            Curve Data
            dataStepCompletionTraffic.series[0] = data.stepCompletionWeeklyTraffic;
            optionsStepCompletionTraffic.high =  Math.max(data.stepCompletionWeeklyTraffic + 50);
//
// //            Bar Data
//             dataBarEventsStepsTraffic.series[0] = data.eventStepTraffic.events;
//             dataBarEventsStepsTraffic.series[1] = data.eventStepTraffic.steps;
            
            this.forceUpdate();
         });
    }

  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className=" text-warning" class="fa fa-qrcode" />}
                statsText="Scanners"
                statsValue={this.state.numberOfScanners}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fas fa-shoe-prints" style={{color:'blue'}}/>}
                statsText="Steps"
                statsValue={this.state.numberOfSteps}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-check" style={{color:'green'}}/>}
                statsText="Fully Completed"
                statsValue={this.state.numberOfFullyCompleted}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last 12 hours"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fas fa-users text-info" />}
                statsText="Participants"
                statsValue={this.state.numberOfParticipants}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
            <Row>
                <Col md={4}>
                    <Card
                        title="Scanner's Ratio"
                        category="Scanners vs Users"
                        stats="Updated just now"
                        statsIcon="fa fa-history"
                        content={
                            <div
                                id="chartPreferences"
                                className="ct-chart ct-perfect-fourth"
                            >
                                <ChartistGraph data={dataPieAccountScannersRatio} type="Pie" />
                            </div>
                        }
                        legend={
                            <div className="legend">{this.createLegend(legendPieAccountScannersRatio)}</div>
                        }
                    />
                </Col>
                <Col md={4}>
                    <Card
                        title="Fully Completed Ratio"
                        category="Participants vs Fully Completed"
                        stats="Updated just now"
                        statsIcon="fa fa-history"
                        content={
                            <div
                                id="chartPreferences"
                                className="ct-chart ct-perfect-fourth"
                            >
                                <ChartistGraph data={dataPieAccountFullyCompletedRatio} type="Pie" />
                            </div>
                        }
                        legend={
                            <div className="legend">{this.createLegend(legendPieAccountFullyCompletedRatio)}</div>
                        }
                    />
                </Col>

                <Col md={4}>
                    <Card
                        title="Participants Ratio"
                        category="Participants vs Users"
                        stats="Updated just now"
                        statsIcon="fa fa-history"
                        content={
                            <div
                                id="chartPreferences"
                                className="ct-chart ct-perfect-fourth"
                            >
                                <ChartistGraph data={dataPieAccountParticipantsRatio} type="Pie" />
                            </div>
                        }
                        legend={
                            <div className="legend">{this.createLegend(legendPieAccountParticipantsRatio)}</div>
                        }
                    />
                </Col>
            </Row>
            <Row style={{justifyContent: 'center'}}>

                <button icon={{
                    name: "arrow-right",
                    size: 15,
                    color: "white"
                }} style={{marginRight: 200, height: 100, justifyContent: 'center', alignSelf:'center', fontWeight: "bold"}} className='btn btn-success' onClick={()=>{
                    this.getData(this.state.hashedIDEvent);
                }}>Refresh</button>
                <Col md={8}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        title="Step Completion"
                        category=""
                        stats="Updated every 3 seconds"
                        content={
                            <div className="ct-chart">
                                <ChartistGraph
                                    style={{}}
                                    options={{
                                    onlyInteger: true,
                                    axisY: {
                                        labelInterpolationFnc: function (value) {
                                            return value;
                                        }
                                    }
                                }} data={{labels: this.state.stepTitles, series: [this.state.stepsCompletion]}} type={"Bar"} />
                            </div>

                        }
                        legend={
                            <div className="legend" >{this.createLegend(legendStepCompletionTraffic)}</div>
                        }
                    />
                </Col>
            </Row>
            <Row style={{justifyContent: 'center'}}>
                <Col md={8}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        title="Step Completion Traffic"
                        category="7 Days Traffic"
                        stats="Updated just now"
                        content={
                            <div className="ct-chart">
                                <ChartistGraph
                                    data={dataStepCompletionTraffic}
                                    type="Line"
                                    options={optionsStepCompletionTraffic}
                                    responsiveOptions={responsiveStepCompletionTraffic}
                                />
                            </div>
                        }
                        legend={
                            <div className="legend" >{this.createLegend(legendStepCompletionTraffic)}</div>
                        }

                    />
                </Col>
            </Row>
          {/*<Row>*/}
            {/*<Col md={8}>*/}
              {/*<Card*/}
                {/*statsIcon="fa fa-history"*/}
                {/*id="chartHours"*/}
                {/*title="Users Traffic"*/}
                {/*category="7 Days Traffic"*/}
                {/*stats="Updated just now"*/}
                {/*content={*/}
                  {/*<div className="ct-chart">*/}
                    {/*<ChartistGraph*/}
                      {/*data={dataTraffic}*/}
                      {/*type="Line"*/}
                      {/*options={optionsTraffic}*/}
                      {/*responsiveOptions={responsiveTraffic}*/}
                    {/*/>*/}
                  {/*</div>*/}
                {/*}*/}
                {/*legend={*/}
                  {/*<div className="legend" >{this.createLegend(legendTraffic)}</div>*/}
                {/*}*/}
              {/*/>*/}
            {/*</Col>*/}
            {/*<Col md={4}>*/}
              {/*<Card*/}
                {/*title="Accounts Statistics"*/}
                {/*category="Activated Accounts vs Non-Activated Accounts"*/}
                {/*stats="Updated just now"*/}
                {/*statsIcon="fa fa-history"*/}
                {/*content={*/}
                  {/*<div*/}
                    {/*id="chartPreferences"*/}
                    {/*className="ct-chart ct-perfect-fourth"*/}
                  {/*>*/}
                    {/*<ChartistGraph data={dataPieAcountActivationRatio} type="Pie" />*/}
                  {/*</div>*/}
                {/*}*/}
                {/*legend={*/}
                  {/*<div className="legend">{this.createLegend(legendPieAcountActivationRatio)}</div>*/}
                {/*}*/}
              {/*/>*/}
            {/*</Col>*/}
          {/*</Row>*/}

        </Container>
      </div>
    );
  }
}

export default withRouter(eventStatistics);
