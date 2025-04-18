import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./storevisitors.css";

function Storevisitors() {
  const [state, setState] = useState({
    series: [44, 55, 41],
    options: {
      chart: {
        type: "donut",
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient", 
        gradient: {
          shade: "dark",
          type: "vertical", // Specify gradient direction
          gradientToColors: ["#1C1C1C", "#92BFFF", "#94E9B8"], // End colors
          stops: [0, 100],
        },
      },
      colors: ["#000000", "#92BFFF", "#94E9B8"], // Base colors
      labels: ["Syopi User", "Newbie", "Explore People"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
      className="store-visitors"
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 className="sv-title">Store Visitors</h3>
        <select
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          className="sv-dropdown"
        >
          <option className="sv-option">Last 7 Days</option>
          <option className="sv-option">Last 30 Days</option>
          <option className="sv-option">Last Year</option>
        </select>
      </div>

      {/* Chart and Legend Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ height: "100%",marginLeft:'-10%' }}>
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="donut"
          />
        </div>
        <div
          style={{
            width: "20%",
            display: "flex",
            flexDirection: "column",
            gap: "15px", 
          }}
        >
          {state.series.map((value, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
              }}
            >
              <span className="sv-label">{state.options.labels[index]}</span>
              <span className="sv-label">{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Storevisitors;


