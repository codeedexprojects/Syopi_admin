import React, { useState } from 'react';

function UserReferrals({ refferals = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter referrals based on search term
  const filteredReferrals = refferals.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referredBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-fluid " style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="mb-0 text-dark">User Referrals</h4>
              <small className="text-muted">Total: {filteredReferrals.length} users</small>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, phone, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 text-dark fw-semibold">Name</th>
                  <th className="border-0 text-dark fw-semibold">Email</th>
                  <th className="border-0 text-dark fw-semibold">Phone</th>
                  <th className="border-0 text-dark fw-semibold">Coins</th>
                  <th className="border-0 text-dark fw-semibold">Referral Code</th>
                  <th className="border-0 text-dark fw-semibold">Referred By</th>
                  <th className="border-0 text-dark fw-semibold">Status</th>
                  <th className="border-0 text-dark fw-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.length > 0 ? (
                  filteredReferrals.map((user) => (
                    <tr key={user._id} className="border-bottom">
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                               style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="fw-medium text-dark">{user.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted">{user.email || 'N/A'}</td>
                      <td className="py-3 text-muted">{user.phone || 'N/A'}</td>
                      <td className="py-3">
                        <span className="badge bg-warning text-dark">{user.coins || 0}</span>
                      </td>
                      <td className="py-3">
                        <code className="bg-light text-primary px-2 py-1 rounded">{user.referralCode || 'N/A'}</code>
                      </td>
                      <td className="py-3">
                        {user.referredBy ? (
                          <code className="bg-light text-success px-2 py-1 rounded">{user.referredBy}</code>
                        ) : (
                          <span className="text-muted">Direct</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-muted small">
                        {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <div>
                        <i className="fas fa-search fa-2x mb-3 text-muted"></i>
                        <p className="mb-0">No users found matching your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}

export default UserReferrals;