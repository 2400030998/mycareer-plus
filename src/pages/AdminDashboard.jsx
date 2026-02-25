import React, { useState, useEffect } from 'react'
import './Dashboard.css'

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [pendingAdmins, setPendingAdmins] = useState([])
  const [assessments, setAssessments] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [classes, setClasses] = useState([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddAssessment, setShowAddAssessment] = useState(false)
  const [showCreateClass, setShowCreateClass] = useState(false)
  const [showTicketReply, setShowTicketReply] = useState(null)
  const [selectedIdCard, setSelectedIdCard] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'student',
    status: 'active'
  })
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'career',
    questions: '',
    duration: 10,
    classId: ''
  })
  const [newClass, setNewClass] = useState({
    className: '',
    classCode: generateClassCode(),
    subject: '',
    section: '',
    academicYear: new Date().getFullYear().toString(),
    description: ''
  })
  const [replyMessage, setReplyMessage] = useState('')

  // Generate unique class code
  function generateClassCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Load all data from localStorage
  const loadData = () => {
    // Load all users
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    setUsers(allUsers.filter(u => u.userType === 'student'))

    // Load pending admin requests
    const pending = JSON.parse(localStorage.getItem('pendingAdmins') || '[]')
    setPendingAdmins(pending)

    // Load assessments
    const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]')
    setAssessments(allAssessments)

    // Load support tickets
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]')
    setSupportTickets(tickets)

    // Load classes
    const allClasses = JSON.parse(localStorage.getItem('classes') || '[]')
    setClasses(allClasses)
  }

  useEffect(() => {
    loadData()
    window.addEventListener('storage', loadData)
    return () => window.removeEventListener('storage', loadData)
  }, [])

  // Handle admin approval
  const handleApproveAdmin = (adminRequest) => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    
    const newAdmin = {
      ...adminRequest,
      id: Date.now(),
      status: 'active',
      approvedBy: 'Super Admin',
      approvedDate: new Date().toLocaleDateString(),
      userType: 'admin'
    }
    
    allUsers.push(newAdmin)
    localStorage.setItem('allUsers', JSON.stringify(allUsers))

    const updatedPending = pendingAdmins.filter(p => p.email !== adminRequest.email)
    localStorage.setItem('pendingAdmins', JSON.stringify(updatedPending))
    
    setPendingAdmins(updatedPending)
    setUsers(allUsers.filter(u => u.userType === 'student'))
    
    alert(`✅ Admin request approved for ${adminRequest.name}`)
  }

  // Handle admin rejection
  const handleRejectAdmin = (adminRequest) => {
    if (window.confirm(`Reject admin request for ${adminRequest.name}?`)) {
      const updatedPending = pendingAdmins.filter(p => p.email !== adminRequest.email)
      localStorage.setItem('pendingAdmins', JSON.stringify(updatedPending))
      setPendingAdmins(updatedPending)
      alert(`❌ Admin request rejected for ${adminRequest.name}`)
    }
  }

  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
      const updatedUsers = allUsers.filter(user => user.id !== userId)
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
      setUsers(updatedUsers.filter(u => u.userType === 'student'))
      alert('User deleted successfully!')
    }
  }

  // Handle toggle user status
  const handleToggleUserStatus = (userId) => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const updatedUsers = allUsers.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
      }
      return user
    })
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
    setUsers(updatedUsers.filter(u => u.userType === 'student'))
  }

  // Handle add user
  const handleAddUser = (e) => {
    e.preventDefault()
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    
    const newStudent = {
      ...newUser,
      id: Date.now(),
      joinDate: new Date().toLocaleDateString(),
      certificates: [],
      education: '',
      enrolledClasses: []
    }
    
    allUsers.push(newStudent)
    localStorage.setItem('allUsers', JSON.stringify(allUsers))
    setUsers(allUsers.filter(u => u.userType === 'student'))
    setShowAddUser(false)
    setNewUser({ name: '', email: '', password: '', phone: '', userType: 'student', status: 'active' })
    alert('Student added successfully!')
  }

  // Handle create class
  const handleCreateClass = (e) => {
    e.preventDefault()
    const allClasses = JSON.parse(localStorage.getItem('classes') || '[]')
    
    const newClassData = {
      ...newClass,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString(),
      createdBy: 'Admin',
      students: [],
      assessments: [],
      classCode: generateClassCode()
    }
    
    allClasses.push(newClassData)
    localStorage.setItem('classes', JSON.stringify(allClasses))
    setClasses(allClasses)
    setShowCreateClass(false)
    setNewClass({
      className: '',
      classCode: generateClassCode(),
      subject: '',
      section: '',
      academicYear: new Date().getFullYear().toString(),
      description: ''
    })
    alert('Class created successfully! Class Code: ' + newClassData.classCode)
  }

  // Handle add assessment
  const handleAddAssessment = (e) => {
    e.preventDefault()
    const questionsArray = newAssessment.questions.split('\n').filter(q => q.trim() !== '')
    const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]')
    
    const newAssess = {
      ...newAssessment,
      questions: questionsArray,
      id: Date.now(),
      created: new Date().toLocaleDateString(),
      submissions: []
    }
    
    allAssessments.push(newAssess)
    localStorage.setItem('assessments', JSON.stringify(allAssessments))
    setAssessments(allAssessments)
    setShowAddAssessment(false)
    setNewAssessment({ title: '', type: 'career', questions: '', duration: 10, classId: '' })
    alert('Assessment created successfully!')
  }

  // Handle delete class
  const handleDeleteClass = (classId) => {
    if (window.confirm('Delete this class? All associated data will be lost.')) {
      const allClasses = classes.filter(c => c.id !== classId)
      localStorage.setItem('classes', JSON.stringify(allClasses))
      setClasses(allClasses)
      alert('Class deleted!')
    }
  }

  // Handle reply to support ticket
  const handleReplyTicket = (ticketId) => {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]')
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId ? { 
        ...ticket, 
        status: 'resolved',
        reply: replyMessage,
        repliedDate: new Date().toLocaleDateString()
      } : ticket
    )
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets))
    setSupportTickets(updatedTickets)
    setShowTicketReply(null)
    setReplyMessage('')
    alert('Reply sent successfully!')
  }

  // Calculate statistics
  const getStats = () => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const students = allUsers.filter(u => u.userType === 'student')
    const activeStudents = students.filter(u => u.status === 'active').length
    const pendingCount = pendingAdmins.length
    const openTickets = supportTickets.filter(t => t.status === 'open').length

    return {
      totalStudents: students.length,
      activeStudents,
      pendingRequests: pendingCount,
      openTickets,
      totalAssessments: assessments.length,
      totalClasses: classes.length
    }
  }

  const stats = getStats()

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-users"></i>
                <div>
                  <h3>Total Students</h3>
                  <p>{stats.totalStudents}</p>
                  <small>{stats.activeStudents} active</small>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-school"></i>
                <div>
                  <h3>Active Classes</h3>
                  <p>{stats.totalClasses}</p>
                  <button className="stat-action" onClick={() => setActiveTab('classes')}>
                    Manage →
                  </button>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-user-clock"></i>
                <div>
                  <h3>Pending Admins</h3>
                  <p>{stats.pendingRequests}</p>
                  {stats.pendingRequests > 0 && (
                    <button className="stat-action" onClick={() => setActiveTab('pending-admins')}>
                      Review →
                    </button>
                  )}
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-clipboard-list"></i>
                <div>
                  <h3>Assessments</h3>
                  <p>{stats.totalAssessments}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <div className="action-card" onClick={() => setShowCreateClass(true)}>
                  <i className="fas fa-plus-circle"></i>
                  <span>Create Class</span>
                  <small>Generate class code</small>
                </div>
                <div className="action-card" onClick={() => setShowAddAssessment(true)}>
                  <i className="fas fa-pen"></i>
                  <span>Create Test</span>
                  <small>Add to class</small>
                </div>
                <div className="action-card" onClick={() => setShowAddUser(true)}>
                  <i className="fas fa-user-plus"></i>
                  <span>Add Student</span>
                </div>
                <div className="action-card" onClick={() => setActiveTab('classes')}>
                  <i className="fas fa-school"></i>
                  <span>View Classes</span>
                </div>
              </div>
            </div>

            {/* Recent Classes */}
            {classes.length > 0 && (
              <div className="recent-section">
                <h3>Recent Classes</h3>
                <div className="classes-grid">
                  {classes.slice(0, 3).map(cls => (
                    <div key={cls.id} className="class-card">
                      <div className="class-header">
                        <i className="fas fa-school"></i>
                        <span className="class-code">{cls.classCode}</span>
                      </div>
                      <h4>{cls.className}</h4>
                      <p>{cls.subject} - {cls.section}</p>
                      <div className="class-stats">
                        <span><i className="fas fa-users"></i> {cls.students?.length || 0} students</span>
                        <span><i className="fas fa-pen"></i> {cls.assessments?.length || 0} tests</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'classes':
        return (
          <div className="classes-page">
            <div className="page-header">
              <h2>Manage Classes</h2>
              <button className="add-btn" onClick={() => setShowCreateClass(true)}>
                <i className="fas fa-plus"></i> Create Class
              </button>
            </div>

            <div className="classes-grid full">
              {classes.map(cls => (
                <div key={cls.id} className="class-card large">
                  <div className="class-header">
                    <div>
                      <span className="class-code-badge">{cls.classCode}</span>
                      <h3>{cls.className}</h3>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeleteClass(cls.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <p className="class-desc">{cls.description || 'No description'}</p>
                  <div className="class-details">
                    <span><i className="fas fa-book"></i> {cls.subject}</span>
                    <span><i className="fas fa-users"></i> Section {cls.section}</span>
                    <span><i className="fas fa-calendar"></i> {cls.academicYear}</span>
                  </div>
                  <div className="class-stats-box">
                    <div className="stat">
                      <span className="number">{cls.students?.length || 0}</span>
                      <span>Students</span>
                    </div>
                    <div className="stat">
                      <span className="number">{cls.assessments?.length || 0}</span>
                      <span>Tests</span>
                    </div>
                    <div className="stat">
                      <span className="number">{cls.assessments?.filter(t => t.submitted)?.length || 0}</span>
                      <span>Submissions</span>
                    </div>
                  </div>
                  <div className="class-actions">
                    <button className="view-btn">
                      <i className="fas fa-eye"></i> View
                    </button>
                    <button className="copy-btn" onClick={() => {
                      navigator.clipboard.writeText(cls.classCode)
                      alert('Class code copied!')
                    }}>
                      <i className="fas fa-copy"></i> Copy Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'pending-admins':
        return (
          <div className="pending-admins-page">
            <h2>Pending Admin Requests</h2>
            <p className="page-description">Review and approve/reject admin registration requests</p>

            {pendingAdmins.length > 0 ? (
              <div className="pending-grid">
                {pendingAdmins.map((admin, index) => (
                  <div key={index} className="pending-card">
                    <div className="card-header">
                      <img src={`https://ui-avatars.com/api/?name=${admin.name}&background=6366f1&color=fff&size=64`} alt={admin.name} />
                      <div>
                        <h3>{admin.name}</h3>
                        <p>{admin.email}</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <p><strong>Department:</strong> {admin.department || 'Not specified'}</p>
                      <p><strong>Phone:</strong> {admin.phone || 'Not provided'}</p>
                      <p><strong>Requested:</strong> {admin.requestDate || admin.joinDate}</p>
                      <p><strong>Reason:</strong> {admin.reason || 'Wants to become admin'}</p>
                      {admin.idCard && (
                        <div className="id-card-section">
                          <strong>ID Card:</strong>
                          <button 
                            className="view-id-btn" 
                            onClick={() => setSelectedIdCard(admin.idCard)}
                          >
                            <i className="fas fa-id-card"></i> View ID Card
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <button className="approve-btn" onClick={() => handleApproveAdmin(admin)}>
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleRejectAdmin(admin)}>
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <i className="fas fa-check-circle"></i>
                <p>No pending admin requests</p>
              </div>
            )}
          </div>
        )

      case 'users':
        return (
          <div className="users-page">
            <div className="page-header">
              <h2>Manage Students</h2>
              <button className="add-btn" onClick={() => setShowAddUser(true)}>
                <i className="fas fa-plus"></i> Add Student
              </button>
            </div>

            <div className="user-stats">
              <div className="user-stat">
                <span>Total Students</span>
                <strong>{stats.totalStudents}</strong>
              </div>
              <div className="user-stat">
                <span>Active</span>
                <strong>{stats.activeStudents}</strong>
              </div>
              <div className="user-stat">
                <span>In Classes</span>
                <strong>{users.filter(u => u.enrolledClasses?.length > 0).length}</strong>
              </div>
            </div>

            <table className="data-table full-width">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Classes</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt={user.name} />
                        <div>
                          <strong>{user.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{user.email}</div>
                      <small>{user.phone || 'No phone'}</small>
                    </td>
                    <td>
                      <span className="class-count">{user.enrolledClasses?.length || 0} classes</span>
                    </td>
                    <td>
                      <button 
                        className={`status-toggle ${user.status}`}
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td>{user.joinDate}</td>
                    <td>
                      <button className="action-btn delete" title="Delete" onClick={() => handleDeleteUser(user.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard admin-dashboard">
      {/* ID Card Modal */}
      {selectedIdCard && (
        <div className="modal" onClick={() => setSelectedIdCard(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedIdCard(null)}>&times;</span>
            <h3>ID Card</h3>
            <img src={selectedIdCard} alt="ID Card" style={{width: '100%', maxHeight: '500px', objectFit: 'contain'}} />
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateClass && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCreateClass(false)}>&times;</span>
            <h2>Create New Class</h2>
            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label>Class Name</label>
                <input 
                  type="text" 
                  value={newClass.className}
                  onChange={(e) => setNewClass({...newClass, className: e.target.value})}
                  placeholder="e.g., Computer Science 101"
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={newClass.subject}
                  onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                  placeholder="e.g., Web Development"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Section</label>
                  <input 
                    type="text" 
                    value={newClass.section}
                    onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                    placeholder="e.g., A"
                  />
                </div>
                <div className="form-group">
                  <label>Academic Year</label>
                  <input 
                    type="text" 
                    value={newClass.academicYear}
                    onChange={(e) => setNewClass({...newClass, academicYear: e.target.value})}
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                  placeholder="Class description..."
                />
              </div>
              <div className="class-code-preview">
                <strong>Class Code:</strong> 
                <code>{newClass.classCode}</code>
                <small>Students will use this code to join</small>
              </div>
              <button type="submit" className="btn-submit">Create Class</button>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddUser(false)}>&times;</span>
            <h2>Add New Student</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-submit">Add Student</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Assessment Modal */}
      {showAddAssessment && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddAssessment(false)}>&times;</span>
            <h2>Create New Assessment</h2>
            <form onSubmit={handleAddAssessment}>
              <div className="form-group">
                <label>Assessment Title</label>
                <input 
                  type="text" 
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assessment Type</label>
                <select 
                  value={newAssessment.type}
                  onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                >
                  <option value="career">Career Assessment</option>
                  <option value="personality">Personality Test</option>
                  <option value="skills">Skills Evaluation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select Class</label>
                <select 
                  value={newAssessment.classId}
                  onChange={(e) => setNewAssessment({...newAssessment, classId: e.target.value})}
                  required
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.className} ({cls.classCode})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Questions (one per line)</label>
                <textarea 
                  rows="5"
                  value={newAssessment.questions}
                  onChange={(e) => setNewAssessment({...newAssessment, questions: e.target.value})}
                  placeholder="Enter each question on a new line"
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input 
                  type="number" 
                  value={newAssessment.duration}
                  onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                  min="5"
                  max="60"
                  required
                />
              </div>
              <button type="submit" className="btn-submit">Create Assessment</button>
            </form>
          </div>
        </div>
      )}

      {/* Reply to Ticket Modal */}
      {showTicketReply && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowTicketReply(null)}>&times;</span>
            <h2>Reply to Support Ticket</h2>
            <textarea 
              rows="5"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              className="reply-textarea"
            />
            <div className="modal-actions">
              <button className="btn-submit" onClick={() => handleReplyTicket(showTicketReply)}>
                Send Reply
              </button>
              <button className="btn-cancel" onClick={() => setShowTicketReply(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="dashboard-nav">
        <div className="logo">
          <i className="fas fa-compass"></i>
          <span>MyCareer<span className="logo-highlight">+</span> Admin</span>
        </div>
        <div className="nav-menu">
          <a 
            href="#" 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); loadData(); }}
          >
            <i className="fas fa-home"></i> Dashboard
          </a>
          <a 
            href="#" 
            className={activeTab === 'classes' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('classes'); loadData(); }}
          >
            <i className="fas fa-school"></i> Classes
            {classes.length > 0 && <span className="nav-badge">{classes.length}</span>}
          </a>
          <a 
            href="#" 
            className={activeTab === 'pending-admins' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('pending-admins'); loadData(); }}
          >
            <i className="fas fa-user-clock"></i> Pending
            {pendingAdmins.length > 0 && <span className="nav-badge">{pendingAdmins.length}</span>}
          </a>
          <a 
            href="#" 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('users'); loadData(); }}
          >
            <i className="fas fa-users"></i> Students
          </a>
        </div>
        <div className="nav-right">
          <div className="profile-mini">
            <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="Admin" />
          </div>
          <button className="btn-logout" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>
      
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default AdminDashboard