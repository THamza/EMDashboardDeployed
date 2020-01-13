import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Container, Row, Col } from "react-bootstrap";
import {getStatisticsDataAPICALL} from '../../utils/requests';

import { Card } from "../../components/Card/Card.jsx";
import { StatsCard } from "../../components/StatsCard/StatsCard.jsx";
import { Tasks } from "../../components/Tasks/Tasks.jsx";

import {
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "../../variables/Variables.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';


var dataBarEventsStepsTraffic = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  series: [
  ]
};
var optionsBarEventsStepsTraffic = {
  seriesBarDistance: 10,
  axisX: {
    showGrid: false
  },
  height: "245px"
};
var responsiveBarEventsStepsTraffic = [
  [
    "screen and (max-width: 640px)",
    {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function(value) {
          return value[0];
        }
      }
    }
  ]
];
var legendBarEventsStepsTraffic = {
  names: ["Events Created", "Steps Created"],
  types: ["info", "danger"]
};


let dataPieAcountActivationRatio = {
      labels: [],
      series: []
    };
let legendPieAcountActivationRatio = {
      names: ["Activated", "Not-Activated"],
      types: ["info", "danger"]
    };
var dataTraffic = {
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
var optionsTraffic = {
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
var responsiveTraffic = [
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
var legendTraffic = {
  names: ["Connections "],
  types: ["info"]
};

class Statistics extends Component {
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
            numberOfUsers : 0,
            numberOfErrors: 0,
            numberOfEvents: 0,
            numberOfSteps: 0

        }
    }
    
    getData(){
         console.log("Getting data..");
        var data = [];
        return getStatisticsDataAPICALL(this.state.object)
        .then((res) => {
            console.log(res);
           data = res.data.data;

             this.setState({
                 numberOfUsers: data.numberOfUsers,
                 numberOfErrors: data.numberOfErrors,
                 numberOfEvents: data.numberOfEvents,
                 numberOfSteps: data.numberOfSteps
             })
//            Pie Data
            dataPieAcountActivationRatio.series = [data.numberOfActivatedAccounts, data.numberOfUsers-data.numberOfActivatedAccounts] ;
            dataPieAcountActivationRatio.labels = [(parseInt((data.numberOfActivatedAccounts*100)/data.numberOfUsers)).toString()+"%", (parseInt((data.numberOfUsers-data.numberOfActivatedAccounts)*100/data.numberOfUsers)).toString()+"%"];
            
//            Curve Data
            dataTraffic.series[0] = data.weeklyTraffic;
            optionsTraffic.high =  Math.max(data.weeklyTraffic + 50);
            
//            Bar Data
            dataBarEventsStepsTraffic.series[0] = data.eventStepTraffic.events;
            dataBarEventsStepsTraffic.series[1] = data.eventStepTraffic.steps;
            
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
                bigIcon={<i className=" text-warning" class="fas fa-shoe-prints" />}
                statsText="Steps"
                statsValue={this.state.numberOfSteps}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fas fa-calendar-alt text-success" />}
                statsText="Events"
                statsValue={this.state.numberOfEvents}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue={this.state.numberOfErrors}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last 12 hours"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fas fa-users text-info" />}
                statsText="Users"
                statsValue={this.state.numberOfUsers}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Users Traffic"
                category="7 Days Traffic"
                stats="Updated just now"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataTraffic}
                      type="Line"
                      options={optionsTraffic}
                      responsiveOptions={responsiveTraffic}
                    />
                  </div>
                }
                legend={
                  <div className="legend" >{this.createLegend(legendTraffic)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                title="Accounts Statistics"
                category="Activated Accounts vs Non-Activated Accounts"
                stats="Updated just now"
                statsIcon="fa fa-history"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPieAcountActivationRatio} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPieAcountActivationRatio)}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="Events/Steps Traffic"
                stats="Updated just now"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBarEventsStepsTraffic}
                      type="Bar"
                      options={optionsBarEventsStepsTraffic}
                      responsiveOptions={responsiveBarEventsStepsTraffic}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBarEventsStepsTraffic)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated just now"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Statistics;
