import React from 'react'

function PendingAdminCard({ admin, onApprove, onReject, onViewId }) {
  return (
    <div className="pending-card">
      <div className="card-header">
        <img src={`https://ui-avatars.com/api/?name=${admin.name}&background=6366f1&color=fff`} alt={admin.name} />
        <div>
          <h3>{admin.name}</h3>
          <p>{admin.email}</p>
        </div>
      </div>
      <div className="card-body">
        <p><strong>Department:</strong> {admin.department || 'Not specified'}</p>
        <p><strong>Phone:</strong> {admin.phone || 'Not provided'}</p>
        {admin.idCard && (
          <button className="view-id-btn" onClick={() => onViewId(admin.idCard)}>
            <i className="fas fa-id-card"></i> View ID Card
          </button>
        )}
      </div>
      <div className="card-footer">
        <button className="approve-btn" onClick={() => onApprove(admin)}>Approve</button>
        <button className="reject-btn" onClick={() => onReject(admin)}>Reject</button>
      </div>
    </div>
  )
}

export default PendingAdminCard