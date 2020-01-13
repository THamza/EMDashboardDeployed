import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Container, Row, Col } from "react-bootstrap";
import {getStepStatisticsDataAPICALL} from '../../utils/requests';

import {withRouter} from 'react-router-dom';

import { Card } from "../../components/Card/Card.jsx";
import { StatsCard } from "../../components/StatsCard/StatsCard.jsx";

import '@fortawesome/fontawesome-free/css/all.min.css';

let dataPieCompletedRatio = {
    labels: [],
    series: []
};
let legendPieCompletedRatio = {
    names: ["Completed", "Participants"],
    types: ["info", "danger"]
};

let dataPieScannersRatio = {
    labels: [],
    series: []
};
let legendPieScannersRatio = {
    names: ["Event Scanners", "Step Scanners"],
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
  names: ["Connections "],
  types: ["info"]
};

class stepStatistics extends Component {
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
            numberOfParticipants: 0,
            numberOfCompleted: 0,
            numberOfStepScanners: 0,
            numberOfEventScanners: 0,
            stepCompletionWeeklyTraffic: []

        }
    }
    
    getData(){
         console.log("Getting data..");
        let data = [];
        return getStepStatisticsDataAPICALL(this.props.history.location.state.hashedIDEvent, this.props.history.location.state.hashedIDStep)
        .then((res) => {
            console.log(res);
           data = res.data.data;

             this.setState({
                 numberOfParticipants: data.numberOfParticipants,
                 numberOfCompleted: data.numberOfCompleted,
                 numberOfStepScanners: data.numberOfStepScanners,
                 numberOfEventScanners: data.numberOfEventScanners,
                 stepCompletionWeeklyTraffic: data.stepCompletionWeeklyTraffic
             });

             // Pie Data Scanners vs Users
            dataPieCompletedRatio.series = [data.numberOfCompleted, data.numberOfParticipants-data.numberOfCompleted] ;
            dataPieCompletedRatio.labels = [(parseInt((data.numberOfCompleted*100)/data.numberOfParticipants)).toString()+"%", (parseInt((data.numberOfParticipants-data.numberOfCompleted)*100/data.numberOfParticipants)).toString()+"%"];

            // Pie Data Participants vs Fully Complted
            dataPieScannersRatio.series = [data.numberOfStepScanners, data.numberOfEventScanners-data.numberOfStepScanners] ;
            dataPieScannersRatio.labels = [(parseInt((data.numberOfStepScanners*100)/data.numberOfEventScanners)).toString()+"%", (parseInt((data.numberOfEventScanners-data.numberOfStepScanners)*100/data.numberOfEventScanners)).toString()+"%"];

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
    
    componentWillMount(){
        let thing = [];
        this.getData();
    }

  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="text-warning" class="fa fa-qrcode" />}
                statsText="Event Scanners"
                statsValue={this.state.numberOfEventScanners}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fas fa-shoe-prints" style={{color:'blue'}}/>}
                statsText="Step Scanners"
                statsValue={this.state.numberOfStepScanners}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-check" style={{color:'green'}}/>}
                statsText="Completed"
                statsValue={this.state.numberOfCompleted}
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
            <Row style={{justifyContent:'center', alignItems:'center'}}>
                <Col md={4}>
                    <Card
                        title="Completion Ratio"
                        category="Completed vs Participants"
                        stats="Updated just now"
                        statsIcon="fa fa-history"
                        content={
                            <div
                                id="chartPreferences"
                                className="ct-chart ct-perfect-fourth"
                            >
                                <ChartistGraph data={dataPieCompletedRatio} type="Pie" />
                            </div>
                        }
                        legend={
                            <div className="legend">{this.createLegend(legendPieCompletedRatio)}</div>
                        }
                    />
                </Col>
                <Col md={4}>
                    <Card
                        title="Scanner's Ratop"
                        category="Event Scanners vs Step Scanners"
                        stats="Updated just now"
                        statsIcon="fa fa-history"
                        content={
                            <div
                                id="chartPreferences"
                                className="ct-chart ct-perfect-fourth"
                            >
                                <ChartistGraph data={dataPieScannersRatio} type="Pie" />
                            </div>
                        }
                        legend={
                            <div className="legend">{this.createLegend(legendPieScannersRatio)}</div>
                        }
                    />
                </Col>
            </Row>

            <Row style={{justifyContent:'center', alignItems:'center'}}>
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

        </Container>
      </div>
    );
  }
}

export default withRouter(stepStatistics);
