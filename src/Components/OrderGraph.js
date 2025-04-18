import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './ordergraph.css'
const ApexChart = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: 'Pending Order',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
      {
        name: 'Proceeded Order',
        data: [15, 32, 45, 50, 60, 70, 85, 100, 120],
      },
      {
        name: 'Cancelled',
        data: [2, 3, 4, 0, 80, 10, 11, 15, 150],
      },
      {
        name: 'Shipped',
        data: [15, 18, 25, 37, 48, 54, 25, 125, 50],
      },
      {
        name: 'Delivered',
        data: [19, 3, 8, 34, 80, 100, 110, 125, 150],
      },
    ],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100],
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#8e8da4',
          },
          formatter: function (val) {
            return val.toFixed(0); // Adjust as needed
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          rotate: -15,
          rotateAlways: true,
        },
      },
      title: {
        text: 'Order Details',
        align: 'left',
        offsetX: 14,
      },
      tooltip: {
        shared: true,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetX: -10,
      },
    },
  });

  return (
    <div>
      <div id="chart" className='order-graph'>
        <ReactApexChart options={state.options} series={state.series} type="area" />
      </div>
    </div>
  );
};

export default ApexChart;
