import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const OrderStatistics = ({ dashboardData }) => {
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');
  
  // Process the order status data for the chart
  let chartData = [];
  
  if (dashboardData && dashboardData.data && dashboardData.data.orderStatusCount) {
    const totalOrders = dashboardData.data.totalOrders;
    
    chartData = dashboardData.data.orderStatusCount.map(item => {
      const percentage = Math.round((item.count / totalOrders) * 100);
      
      // Define colors for different statuses
      let color;
      switch(item._id) {
        case 'Delivered':
          color = '#00226C';
          break;
        case 'Cancelled':
          color = '#0450C2';
          break;
        case 'Confirmed':
          color = '#0073DC';
          break;
        case 'Pending':
          color = '#9CD9FF';
          break;
        default:
          color = '#0D98FF';
      }
      
      return {
        name: item._id,
        value: item.count,
        text: `${percentage}%`,
        fill: color
      };
    });
  } else {
    // Fallback data if dashboardData is not available
    chartData = [
      { name: 'Delivered', value: 6, text: '10%', fill: '#00226C' },
      { name: 'Cancelled', value: 9, text: '16%', fill: '#0450C2' },
      { name: 'Confirmed', value: 31, text: '53%', fill: '#0073DC' },
      { name: 'Pending', value: 12, text: '21%', fill: '#9CD9FF' },
    ];
  }
  
  return (
    <div className="weekly-container">
      <h2>Order Statistics</h2>

      {/* Chart and Content */}
      <div
        className="order-statistics-chart"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Dropdown and Title Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 className="os-title"> All orders</h3>
          <select
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            className="sv-dropdown"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option className="sv-option">Last 7 Days</option>
            <option className="sv-option">Last 30 Days</option>
            <option className="sv-option">Last Year</option>
          </select>
        </div>

        {/* Chart and Labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Aligns chart and labels vertically
            marginTop: '-5%',
          }}
        >
          {/* Donut Chart */}
          <div style={{ flex: '1', maxWidth: '60%' }}>
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} Orders`, name]} />
            </PieChart>
          </div>

          {/* Status Legend */}
          <div
            style={{
              flex: '1',
              maxWidth: '35%',
              paddingLeft: '20px',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {chartData.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: item.fill,
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  ></span>
                  <span className="order-statistics-label">
                    {item.name} - {item.text} ({item.value})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;