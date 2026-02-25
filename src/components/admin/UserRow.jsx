import React from 'react'

function UserRow({ user, onToggleStatus, onDelete }) {
  return (
    <tr>
      <td>
        <div className="user-cell">
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt={user.name} />
          <strong>{user.name}</strong>
        </div>
      </td>
      <td>{user.email}</td>
      <td>
        <span className="class-count">{user.enrolledClasses?.length || 0} classes</span>
      </td>
      <td>
        <button className={`status-toggle ${user.status}`} onClick={() => onToggleStatus(user.id)}>
          {user.status}
        </button>
      </td>
      <td>{user.joinDate}</td>
      <td>
        <button className="action-btn delete" onClick={() => onDelete(user.id)}>
          <i className="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  )
}

export default UserRow