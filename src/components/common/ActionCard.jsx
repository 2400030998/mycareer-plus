import React from 'react'

function ActionCard({ icon, title, subtitle, onClick }) {
  return (
    <div className="action-card" onClick={onClick}>
      <i className={`fas ${icon}`}></i>
      <span>{title}</span>
      {subtitle && <small>{subtitle}</small>}
    </div>
  )
}

export default ActionCard