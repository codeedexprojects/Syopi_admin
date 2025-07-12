import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { getDashboardCommissionApi } from '../services/allApi';
import './Commission.css';

const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }) => (
  <div className="commission-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="commission-stat-content">
      <div>
        <p className="commission-stat-title">{title}</p>
        <p className="commission-stat-value">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
      </div>
      <div className="commission-stat-icon-container" style={{ backgroundColor: `${color}20` }}>
        <Icon style={{ color }} />
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="commission-loading-spinner">
    <RefreshCw className="commission-spinner-icon" />
    <span className="commission-loading-text">Loading commission data...</span>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="commission-error-message">
    <p className="commission-error-text">{message}</p>
    <button
      onClick={onRetry}
      className="commission-retry-btn"
    >
      Retry
    </button>
  </div>
);

function Commission() {
  const [commissionData, setCommissionData] = useState({
    totalSales: 0,
    totalAdminCommission: 0,
    totalPayouts: 0,
    commissionRate: 0
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

  const fetchCommissionData = async (filterType = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDashboardCommissionApi(filterType);
      
      if (response.success) {
        setCommissionData({
          totalSales: response.data.totalSales || 0,
          totalAdminCommission: response.data.totalAdminCommission || 0,
          totalPayouts: response.data.totalPayouts || 0,
          commissionRate: response.data.totalSales > 0 
            ? (response.data.totalAdminCommission / response.data.totalSales) * 100 
            : 0
        });
        setLastUpdated(new Date());
      } else {
        setError(response.error || 'Failed to fetch commission data');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    fetchCommissionData(filterType);
  };

  const handleRefresh = () => {
    fetchCommissionData(selectedFilter);
  };

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getFilterLabel = () => {
    const filter = filterOptions.find(f => f.value === selectedFilter);
    return filter ? filter.label : 'All Time';
  };

  if (loading) {
    return (
      <div className="commission-container">
        <div className="commission-main-container">
          <h1 className="commission-title">Admin Commission Dashboard</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="commission-container">
      <div className="commission-main-container">
        {/* Header */}
        <div className="commission-header">
          <button onClick={handleRefresh} className="commission-refresh-btn">
            <RefreshCw className={`commission-refresh-icon ${loading ? 'commission-spinning' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="commission-filter-card">
          <ul className="commission-filter-tabs">
            {filterOptions.map((filter) => (
              <li className="commission-filter-item" key={filter.value}>
                <button
                  onClick={() => handleFilterChange(filter.value)}
                  className={`commission-filter-link ${selectedFilter === filter.value ? 'active' : ''}`}
                >
                  <filter.icon className="commission-filter-icon" />
                  {filter.label}
                </button>
              </li>
            ))}
          </ul>
          
          {/* Current Filter Info */}
          <div className="commission-filter-info">
            <div className="commission-filter-info-content">
              <span className="commission-filter-label">
                Showing data for: <strong>{getFilterLabel()}</strong>
              </span>
              {lastUpdated && (
                <span className="commission-last-updated">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="commission-error-container">
            <ErrorMessage message={error} onRetry={handleRefresh} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="row commission-stats-row">
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Total Sales"
              value={formatCurrency(commissionData.totalSales)}
              icon={CreditCard}
              color="#3B82F6"
            />
          </div>
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Total Commission"
              value={formatCurrency(commissionData.totalAdminCommission)}
              icon={DollarSign}
              color="#10B981"
            />
          </div>
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Total Payouts"
              value={commissionData.totalPayouts}
              icon={TrendingUp}
              color="#F59E0B"
            />
          </div>
          <div className="col-md-3 col-sm-6">
            <StatCard
              title="Commission Rate"
              value={commissionData.commissionRate.toFixed(2)}
              icon={TrendingUp}
              color="#8B5CF6"
              suffix="%"
            />
          </div>
        </div>

        {/* Summary Table */}
        <div className="commission-summary-card">
          <div className="commission-summary-header">
            <h2 className="commission-summary-title">Commission Summary</h2>
          </div>
          <div className="table-responsive">
            <table className="commission-table">
              <thead className="commission-table-header">
                <tr>
                  <th className="commission-text-left">Metric</th>
                  <th className="commission-text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="commission-text-left">Total Sales</td>
                  <td className="commission-text-right">{formatCurrency(commissionData.totalSales)}</td>
                </tr>
                <tr>
                  <td className="commission-text-left">Admin Commission</td>
                  <td className="commission-text-right">{formatCurrency(commissionData.totalAdminCommission)}</td>
                </tr>
                <tr>
                  <td className="commission-text-left">Total Payouts</td>
                  <td className="commission-text-right">{commissionData.totalPayouts}</td>
                </tr>
                <tr className="commission-net-row">
                  <td className="commission-text-left commission-bold">Commission Rate</td>
                  <td className="commission-text-right commission-bold">
                    {commissionData.commissionRate.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="commission-text-left">Average Commission per Sale</td>
                  <td className="commission-text-right">
                    {commissionData.totalSales > 0 
                      ? formatCurrency(commissionData.totalAdminCommission / commissionData.totalSales)
                      : formatCurrency(0)
                    }
                  </td>
                </tr>
                <tr>
                  <td className="commission-text-left">Average Payout Amount</td>
                  <td className="commission-text-right">
                    {commissionData.totalPayouts > 0 
                      ? formatCurrency(commissionData.totalAdminCommission / commissionData.totalPayouts)
                      : formatCurrency(0)
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* No Data Message */}
        {!loading && !error && commissionData.totalSales === 0 && (
          <div className="commission-no-data">
            <CreditCard className="commission-no-data-icon" />
            <p className="commission-no-data-text">No commission data available for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Commission;