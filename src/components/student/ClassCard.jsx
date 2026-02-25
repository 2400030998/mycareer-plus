import React from 'react'

function ClassCard({ classData, tests, testResults, onTakeTest }) {
  return (
    <div className="class-card">
      <div className="class-header">
        <div>
          <span className="class-code">{classData.classCode}</span>
          <h3>{classData.className}</h3>
        </div>
      </div>
      <p className="class-desc">{classData.subject} - Section {classData.section}</p>
      
      <div className="class-tests">
        <h4>Available Tests</h4>
        {tests.length > 0 ? (
          tests.map(test => (
            <div key={test.id} className="test-item">
              <div className="test-info">
                <h5>{test.title}</h5>
                <span className="test-duration">{test.duration} mins</span>
              </div>
              {testResults[test.id] ? (
                <div className="test-completed">
                  <span className="score-badge">{testResults[test.id].percentage}%</span>
                  <small>Completed</small>
                </div>
              ) : (
                <button className="take-test-btn" onClick={() => onTakeTest(test)}>
                  Take Test
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-tests">No tests available</p>
        )}
      </div>
    </div>
  )
}

export default ClassCard