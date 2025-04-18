import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './weekly.css';

function Weekly() {
  const [state, setState] = useState({
    series: [
      {
        name: 'Stock In',
        data: [44, 55, 57, 56, 61, 58, 63]
      },
      {
        name: 'Stock Out',
        data: [76, 85, 101, 98, 87, 105, 91]
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 10,
          barHeight: '80%',
          distributed: false, // Keep bars grouped together
          dataLabels: {
            position: 'top',
          },
          groupPadding: 0.3, // Add space between two bars for each day
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      yaxis: {
        title: {
          text: 'Activity'
        }
      },
      fill: {
        opacity: 1,
        colors: ['#1814F3', '#16DBCC'] // Assign colors here
      },
      colors: ['#1814F3', '#16DBCC'], // Assign series colors
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          }
        }
      },
      grid: {
        padding: {
          left: 10,
          right: 10
        }
      }
    }
  });

  return (
    <div className="weekly-container">
      <h2>Weekly Activity</h2>
      <div id="chart" className="weekly-chart">
        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
      </div>
    </div>
  );
}

export default Weekly;
