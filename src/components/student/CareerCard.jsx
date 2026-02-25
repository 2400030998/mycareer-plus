import React from 'react'

function CareerCard({ career }) {
  return (
    <div className="career-card">
      <div className="career-header" style={{background: `${career.color}10`}}>
        <div className="career-icon" style={{background: career.color}}>
          <i className={`fas ${career.icon}`}></i>
        </div>
        <span className="match-percent">{career.match}</span>
      </div>
      <div className="career-body">
        <h3>{career.title}</h3>
        <p>{career.description}</p>
        <div className="career-tags">
          {career.skills.map((skill, idx) => (
            <span key={idx} className="career-tag">{skill}</span>
          ))}
        </div>
        <div className="career-footer">
          <div className="salary">
            <i className="fas fa-money-bill-wave"></i>
            <span>{career.salary}</span>
          </div>
          <div className="demand">
            <i className="fas fa-chart-line"></i>
            <span>{career.demand}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerCard