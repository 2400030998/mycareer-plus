import React from 'react'

function StatCard({ icon, title, value, subtext, action }) {
  return (
    <div className="stat-card">
      <i className={`fas ${icon}`}></i>
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
        {subtext && <small>{subtext}</small>}
        {action && (
          <button className="stat-action" onClick={action.onClick}>
            {action.text} →
          </button>
        )}
      </div>
    </div>
  )
}

export default StatCard