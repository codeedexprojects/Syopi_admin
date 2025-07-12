import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Calculator, Calendar, RefreshCw } from 'lucide-react';
import { getDashboardRevenueApi } from '../services/allApi';
import './Revenue.css';

const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }) => (
  <div className="revenue-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="revenue-stat-content">
      <div>
        <p className="revenue-stat-title">{title}</p>
        <p className="revenue-stat-value">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
      </div>
      <div className="revenue-stat-icon-container" style={{ backgroundColor: `${color}20` }}>
        <Icon style={{ color }} />
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="revenue-loading-spinner">
    <RefreshCw className="revenue-spinner-icon" />
    <span className="revenue-loading-text">Loading revenue data...</span>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="revenue-error-message">
    <p className="revenue-error-text">{message}</p>
    <button
      onClick={onRetry}
      className="revenue-retry-btn"
    >
      Retry
    </button>
  </div>
);

function Revenue() {
  const [revenueData, setRevenueData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCost: 0,
    netRevenue: 0
  });
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const filterOptions = [
    { value: '', label: 'All Time', icon: Calendar },
    { value: 'weekly', label: 'This Week', icon: Calendar },
    { value: 'monthly', label: 'This Month', icon: Calendar }
  ];

  const fetchRevenueData = async (filterType = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDashboardRevenueApi(filterType);
      
      if (response.success) {
        setRevenueData({
          totalOrders: response.data.totalOrders || 0,
          totalRevenue: response.data.totalRevenue || 0,
          totalCost: response.data.totalCost || 0,
          netRevenue: response.data.netRevenue || 0
        });
        setLastUpdated(new Date());
      } else {
        setError(response.error || 'Failed to fetch revenue data');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    fetchRevenueData(filterType);
  };

  const handleRefresh = () => {
    fetchRevenueData(selectedFilter);
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFilterLabel = () => {
    const filter = filterOptions.find(f => f.value === selectedFilter);
    return filter ? filter.label : 'All Time';
  };

  if (loading) {
    return (
      <div className="revenue-container">
        <div className="revenue-main-container">
          <h1 className="revenue-title">Admin Revenue Dashboard</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="revenue-container">
      <div className="revenue-main-container">
        <div className="revenue-filter-card">
          <ul className="revenue-filter-tabs">
            {filterOptions.map((filter) => (
              <li className="revenue-filter-item" key={filter.value}>
                <button
                  onClick={() => handleFilterChange(filter.value)}
                  className={`revenue-filter-link ${selectedFilter === filter.value ? 'active' : ''}`}
                >
                  <filter.icon className="revenue-filter-icon" />
                  {filter.label}
                </button>
              </li>
            ))}
          </ul>
          
          {/* Current Filter Info */}
          <div className="revenue-filter-info">
            <div className="revenue-filter-info-content">
              <span className="revenue-filter-label">
                Showing data for: <strong>{getFilterLabel()}</strong>
              </span>
              {lastUpdated && (
                <span className="revenue-last-updated">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="revenue-error-container">
            <ErrorMessage message={error} onRetry={handleRefresh} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="row revenue-stats-row">
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Total Orders"
              value={revenueData.totalOrders}
              icon={Package}
              color="#3B82F6"
            />
          </div>
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(revenueData.totalRevenue)}
              icon={DollarSign}
              color="#10B981"
            />
          </div>
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Total Cost"
              value={formatCurrency(revenueData.totalCost)}
              icon={Calculator}
              color="#F59E0B"
            />
          </div>
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Net Revenue"
              value={formatCurrency(revenueData.netRevenue)}
              icon={TrendingUp}
              color={revenueData.netRevenue >= 0 ? "#10B981" : "#EF4444"}
            />
          </div>
        </div>

        {/* Summary Table */}
        <div className="revenue-summary-card">
          <div className="revenue-summary-header">
            <h2 className="revenue-summary-title">Revenue Summary</h2>
          </div>
          <div className="table-responsive">
            <table className="revenue-table">
              <thead className="revenue-table-header">
                <tr>
                  <th className="revenue-text-left">Metric</th>
                  <th className="revenue-text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="revenue-text-left">Total Orders</td>
                  <td className="revenue-text-right">{revenueData.totalOrders.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="revenue-text-left">Gross Revenue</td>
                  <td className="revenue-text-right">{formatCurrency(revenueData.totalRevenue)}</td>
                </tr>
                <tr>
                  <td className="revenue-text-left">Total Cost</td>
                  <td className="revenue-text-right">{formatCurrency(revenueData.totalCost)}</td>
                </tr>
                <tr className="revenue-net-row">
                  <td className="revenue-text-left revenue-bold">Net Revenue</td>
                  <td className={`revenue-text-right revenue-bold ${
                    revenueData.netRevenue >= 0 ? 'revenue-text-success' : 'revenue-text-danger'
                  }`}>
                    {formatCurrency(revenueData.netRevenue)}
                  </td>
                </tr>
                <tr>
                  <td className="revenue-text-left">Average Order Value</td>
                  <td className="revenue-text-right">
                    {formatCurrency(revenueData.totalOrders > 0 ? revenueData.totalRevenue / revenueData.totalOrders : 0)}
                  </td>
                </tr>
                <tr>
                  <td className="revenue-text-left">Profit Margin</td>
                  <td className={`revenue-text-right ${
                    revenueData.totalRevenue > 0 
                      ? ((revenueData.netRevenue / revenueData.totalRevenue) * 100) >= 0 
                        ? 'revenue-text-success' 
                        : 'revenue-text-danger'
                      : ''
                  }`}>
                    {revenueData.totalRevenue > 0 
                      ? `${((revenueData.netRevenue / revenueData.totalRevenue) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* No Data Message */}
        {!loading && !error && revenueData.totalOrders === 0 && (
          <div className="revenue-no-data">
            <Package className="revenue-no-data-icon" />
            <p className="revenue-no-data-text">No revenue data available for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Revenue;