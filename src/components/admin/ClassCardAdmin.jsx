import React from 'react'

function ClassCardAdmin({ classData, onDelete, onCopyCode }) {
  return (
    <div className="class-card large">
      <div className="class-header">
        <div>
          <span className="class-code-badge">{classData.classCode}</span>
          <h3>{classData.className}</h3>
        </div>
        <button className="delete-btn" onClick={() => onDelete(classData.id)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
      <p className="class-desc">{classData.subject} - Section {classData.section}</p>
      <div className="class-stats-box">
        <div className="stat">
          <span className="number">{classData.students?.length || 0}</span>
          <span>Students</span>
        </div>
        <div className="stat">
          <span className="number">{classData.assessments?.length || 0}</span>
          <span>Tests</span>
        </div>
      </div>
      <div className="class-actions">
        <button className="copy-btn" onClick={() => onCopyCode(classData.classCode)}>
          <i className="fas fa-copy"></i> Copy Code
        </button>
      </div>
    </div>
  )
}

export default ClassCardAdmin