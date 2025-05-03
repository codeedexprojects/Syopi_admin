import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ vendordashboardData }) => {
    console.log("vendordashboard",vendordashboardData)
  const [state, setState] = useState({
    series: [],
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
            return val.toFixed(0);
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

  useEffect(() => {
    if (vendordashboardData && vendordashboardData.orderStatusCount) {
      // Generate random historical data for each status
      // In a real app, you would fetch this data from your API
      const generateHistoricalData = (currentValue) => {
        const data = [];
        // Generate a somewhat realistic trend leading up to the current value
        for (let i = 0; i < 8; i++) {
          // Make the trend somewhat increasing towards the current value
          const value = Math.floor(Math.random() * (currentValue * 0.8)) + 
                        Math.floor((i / 7) * currentValue * 0.5);
          data.push(value);
        }
        // Add the current value as the last point
        data.push(currentValue);
        return data;
      };

      const seriesData = vendordashboardData.orderStatusCount.map(status => {
        return {
          name: status._id,
          data: generateHistoricalData(status.count)
        };
      });

      setState(prevState => ({
        ...prevState,
        series: seriesData
      }));
    }
  }, [vendordashboardData]);

  return (
    <div>
      <div id="chart" className="order-graph">
        <ReactApexChart 
          options={state.options} 
          series={state.series} 
          type="area" 
          height={350} 
        />
      </div>
    </div>
  );
};

export default ApexChart;