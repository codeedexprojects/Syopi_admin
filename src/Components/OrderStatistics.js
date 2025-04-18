import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const OrderStatistics = () => {
  const data1 = [
    { name: 'Delivered', value: 45, text: '45%', fill: '#00226C' },
    { name: 'Canceled', value: 15, text: '15%', fill: '#0450C2' },
    { name: 'Shipped', value: 25, text: '25%', fill: '#0073DC' },
    { name: 'Processed', value: 10, text: '10%', fill: '#0D98FF' },
    { name: 'Pending', value: 5, text: '5%', fill: '#9CD9FF' },
  ];

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
                data={data1}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
              >
                {data1.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
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
              {data1.map((item, index) => (
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
                    {item.name} - {item.text}
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
