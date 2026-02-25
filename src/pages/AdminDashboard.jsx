import React, { useState, useEffect } from 'react'
import './Dashboard.css'

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [pendingAdmins, setPendingAdmins] = useState([])
  const [assessments, setAssessments] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddAssessment, setShowAddAssessment] = useState(false)
  const [showTicketReply, setShowTicketReply] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    userType: 'student',
    status: 'active',
    password: '',
    phone: '',
    department: ''
  })
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'career',
    questions: '',
    duration: 10
  })
  const [replyMessage, setReplyMessage] = useState('')

  // Load all data from localStorage
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load regular users (students)
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
  }

  // Handle admin approval
  const handleApproveAdmin = (adminRequest) => {
    // Add to users list as admin
    const newAdmin = {
      ...adminRequest,
      id: Date.now(),
      status: 'active',
      approvedBy: 'Admin',
      approvedDate: new Date().toLocaleDateString()
    }
    
    const updatedUsers = [...users, newAdmin]
    setUsers(updatedUsers)
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))

    // Remove from pending
    const updatedPending = pendingAdmins.filter(p => p.email !== adminRequest.email)
    setPendingAdmins(updatedPending)
    localStorage.setItem('pendingAdmins', JSON.stringify(updatedPending))

    // Send notification to admin (store in notifications)
    const notification = {
      id: Date.now(),
      email: adminRequest.email,
      message: 'Your admin request has been approved! You can now login as admin.',
      date: new Date().toLocaleDateString(),
      read: false
    }
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.push(notification)
    localStorage.setItem('notifications', JSON.stringify(notifications))

    alert(`Admin request approved for ${adminRequest.name}`)
  }

  // Handle admin rejection
  const handleRejectAdmin = (adminRequest) => {
    if (window.confirm(`Reject admin request for ${adminRequest.name}?`)) {
      const updatedPending = pendingAdmins.filter(p => p.email !== adminRequest.email)
      setPendingAdmins(updatedPending)
      localStorage.setItem('pendingAdmins', JSON.stringify(updatedPending))

      // Send rejection notification
      const notification = {
        id: Date.now(),
        email: adminRequest.email,
        message: 'Your admin request has been rejected. Please contact support for more information.',
        date: new Date().toLocaleDateString(),
        read: false
      }
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      notifications.push(notification)
      localStorage.setItem('notifications', JSON.stringify(notifications))

      alert('Admin request rejected')
    }
  }

  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
      alert('User deleted successfully!')
    }
  }

  // Handle toggle user status
  const handleToggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    )
    setUsers(updatedUsers)
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
  }

  // Handle add user
  const handleAddUser = (e) => {
    e.preventDefault()
    const updatedUsers = [...users, { 
      ...newUser, 
      id: Date.now(), 
      joinDate: new Date().toLocaleDateString(),
      createdBy: 'Admin'
    }]
    setUsers(updatedUsers)
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
    setShowAddUser(false)
    setNewUser({ name: '', email: '', userType: 'student', status: 'active', password: '', phone: '', department: '' })
    alert('User added successfully!')
  }

  // Handle add assessment
  const handleAddAssessment = (e) => {
    e.preventDefault()
    const questionsArray = newAssessment.questions.split('\n').filter(q => q.trim() !== '')
    const updatedAssessments = [...assessments, { 
      ...newAssessment, 
      questions: questionsArray,
      id: Date.now(), 
      created: new Date().toLocaleDateString(),
      createdBy: 'Admin'
    }]
    setAssessments(updatedAssessments)
    localStorage.setItem('assessments', JSON.stringify(updatedAssessments))
    setShowAddAssessment(false)
    setNewAssessment({ title: '', type: 'career', questions: '', duration: 10 })
    alert('Assessment added successfully!')
  }

  // Handle reply to support ticket
  const handleReplyTicket = (ticketId) => {
    const updatedTickets = supportTickets.map(ticket => 
      ticket.id === ticketId ? { 
        ...ticket, 
        status: 'resolved',
        reply: replyMessage,
        repliedDate: new Date().toLocaleDateString(),
        repliedBy: 'Admin'
      } : ticket
    )
    setSupportTickets(updatedTickets)
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets))
    
    // Notify user
    const ticket = supportTickets.find(t => t.id === ticketId)
    const notification = {
      id: Date.now(),
      email: ticket.email,
      message: `Your support ticket has been resolved. Reply: ${replyMessage}`,
      date: new Date().toLocaleDateString(),
      read: false
    }
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    notifications.push(notification)
    localStorage.setItem('notifications', JSON.stringify(notifications))

    setShowTicketReply(null)
    setReplyMessage('')
    alert('Reply sent successfully!')
  }

  // Calculate statistics
  const getStats = () => {
    const totalStudents = users.length
    const activeStudents = users.filter(u => u.status === 'active').length
    const pendingRequests = pendingAdmins.length
    const openTickets = supportTickets.filter(t => t.status === 'open').length
    const totalAssessments = assessments.length
    const totalTestsTaken = parseInt(localStorage.getItem('totalTestsTaken') || '0')

    return {
      totalStudents,
      activeStudents,
      pendingRequests,
      openTickets,
      totalAssessments,
      totalTestsTaken
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
                <i className="fas fa-user-clock"></i>
                <div>
                  <h3>Pending Admin Requests</h3>
                  <p>{stats.pendingRequests}</p>
                  {stats.pendingRequests > 0 && (
                    <button className="stat-action" onClick={() => setActiveTab('pending-admins')}>
                      Review Now →
                    </button>
                  )}
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-ticket-alt"></i>
                <div>
                  <h3>Support Tickets</h3>
                  <p>{stats.openTickets}</p>
                  {stats.openTickets > 0 && (
                    <button className="stat-action" onClick={() => setActiveTab('support')}>
                      View Open →
                    </button>
                  )}
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-clipboard-list"></i>
                <div>
                  <h3>Total Assessments</h3>
                  <p>{stats.totalAssessments}</p>
                  <small>{stats.totalTestsTaken} tests taken</small>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <div className="action-card" onClick={() => setShowAddUser(true)}>
                  <i className="fas fa-user-plus"></i>
                  <span>Add Student</span>
                </div>
                <div className="action-card" onClick={() => setShowAddAssessment(true)}>
                  <i className="fas fa-plus-circle"></i>
                  <span>Create Assessment</span>
                </div>
                <div className="action-card" onClick={() => {
                  const report = generateReport()
                  alert('Report generated! Check downloads folder.')
                }}>
                  <i className="fas fa-file-export"></i>
                  <span>Export Report</span>
                </div>
                <div className="action-card" onClick={() => setActiveTab('settings')}>
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
              </div>
            </div>

            {/* Pending Admin Requests Preview */}
            {pendingAdmins.length > 0 && (
              <div className="pending-section">
                <h3>Pending Admin Requests</h3>
                <div className="pending-list">
                  {pendingAdmins.slice(0, 3).map(admin => (
                    <div key={admin.email} className="pending-item">
                      <img src={`https://ui-avatars.com/api/?name=${admin.name}&background=6366f1&color=fff`} alt={admin.name} />
                      <div className="pending-info">
                        <h4>{admin.name}</h4>
                        <p>{admin.email}</p>
                        <small>Department: {admin.department || 'Not specified'}</small>
                      </div>
                      <div className="pending-actions">
                        <button className="approve-btn" onClick={() => handleApproveAdmin(admin)}>
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="reject-btn" onClick={() => handleRejectAdmin(admin)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {pendingAdmins.length > 3 && (
                  <button className="view-all" onClick={() => setActiveTab('pending-admins')}>
                    View All ({pendingAdmins.length}) →
                  </button>
                )}
              </div>
            )}

            {/* Recent Support Tickets */}
            {supportTickets.filter(t => t.status === 'open').length > 0 && (
              <div className="recent-tickets">
                <h3>Open Support Tickets</h3>
                <div className="tickets-list">
                  {supportTickets.filter(t => t.status === 'open').slice(0, 3).map(ticket => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-header">
                        <h4>{ticket.subject}</h4>
                        <span className="priority-badge">{ticket.priority}</span>
                      </div>
                      <p>{ticket.message.substring(0, 100)}...</p>
                      <div className="ticket-footer">
                        <span>From: {ticket.name}</span>
                        <button className="reply-btn" onClick={() => setShowTicketReply(ticket.id)}>
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'pending-admins':
        return (
          <div className="pending-admins-page">
            <h2>Pending Admin Requests</h2>
            <p className="page-description">Review and approve/reject admin registration requests</p>

            {pendingAdmins.length > 0 ? (
              <div className="pending-grid">
                {pendingAdmins.map(admin => (
                  <div key={admin.email} className="pending-card">
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
                      <p><strong>Requested on:</strong> {admin.requestDate}</p>
                      <p><strong>Reason:</strong> {admin.reason || 'Wants to become admin'}</p>
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
              <p className="no-data">No pending admin requests</p>
            )}
          </div>
        )

      case 'support':
        return (
          <div className="support-page">
            <h2>Support Tickets</h2>
            <div className="ticket-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Open</button>
              <button className="filter-btn">Resolved</button>
              <button className="filter-btn">High Priority</button>
            </div>

            <div className="tickets-grid">
              {supportTickets.map(ticket => (
                <div key={ticket.id} className={`ticket-card ${ticket.priority}`}>
                  <div className="ticket-status">
                    <span className={`status-${ticket.status}`}>{ticket.status}</span>
                    <span className={`priority-${ticket.priority}`}>{ticket.priority}</span>
                  </div>
                  <h3>{ticket.subject}</h3>
                  <p>{ticket.message}</p>
                  <div className="ticket-meta">
                    <span><i className="fas fa-user"></i> {ticket.name}</span>
                    <span><i className="fas fa-calendar"></i> {ticket.date}</span>
                  </div>
                  {ticket.status === 'open' && (
                    <button className="reply-ticket-btn" onClick={() => setShowTicketReply(ticket.id)}>
                      <i className="fas fa-reply"></i> Reply
                    </button>
                  )}
                  {ticket.reply && (
                    <div className="ticket-reply">
                      <strong>Admin Reply:</strong>
                      <p>{ticket.reply}</p>
                      <small>{ticket.repliedDate}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                <span>Inactive</span>
                <strong>{stats.totalStudents - stats.activeStudents}</strong>
              </div>
            </div>

            <table className="data-table full-width">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Active</th>
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
                          <small>ID: {user.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{user.email}</div>
                      <small>{user.phone || 'No phone'}</small>
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
                    <td>{user.lastActive || 'Never'}</td>
                    <td>
                      <button className="action-btn edit" title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
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

      case 'manage-tests':
        return (
          <div className="manage-tests">
            <div className="page-header">
              <h2>Manage Assessments</h2>
              <button className="add-btn" onClick={() => setShowAddAssessment(true)}>
                <i className="fas fa-plus"></i> New Assessment
              </button>
            </div>

            <div className="assessments-grid">
              {assessments.map(assessment => (
                <div key={assessment.id} className="assessment-card">
                  <div className="assessment-type">{assessment.type}</div>
                  <h3>{assessment.title}</h3>
                  <p>{assessment.questions?.length || 0} questions • {assessment.duration} mins</p>
                  <div className="assessment-stats">
                    <span><i className="fas fa-users"></i> 23 taken</span>
                    <span><i className="fas fa-chart-line"></i> 85% avg</span>
                  </div>
                  <div className="assessment-actions">
                    <button className="edit-btn"><i className="fas fa-edit"></i> Edit</button>
                    <button className="delete-btn"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="reports-page">
            <h2>Analytics & Reports</h2>
            
            <div className="report-filters">
              <select className="report-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>This year</option>
              </select>
              <button className="export-report-btn">
                <i className="fas fa-download"></i> Export Report
              </button>
            </div>

            <div className="reports-grid">
              <div className="report-card">
                <h3>User Growth</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-line"></i>
                  <div className="chart-data">
                    <p>Total Users: {stats.totalStudents}</p>
                    <p>New this week: +12</p>
                    <p>Growth rate: +15%</p>
                  </div>
                </div>
              </div>
              <div className="report-card">
                <h3>Assessment Completion</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-pie"></i>
                  <div className="chart-data">
                    <p>Completed: 156</p>
                    <p>In Progress: 45</p>
                    <p>Not Started: 89</p>
                  </div>
                </div>
              </div>
              <div className="report-card">
                <h3>Popular Careers</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-bar"></i>
                  <div className="chart-data">
                    <p>Software Dev: 45%</p>
                    <p>Data Science: 30%</p>
                    <p>UX Design: 25%</p>
                  </div>
                </div>
              </div>
              <div className="report-card">
                <h3>Support Tickets</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-ticket-alt"></i>
                  <div className="chart-data">
                    <p>Open: {stats.openTickets}</p>
                    <p>Resolved: 234</p>
                    <p>Avg response: 2h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Helper function to generate report
  const generateReport = () => {
    const report = {
      generated: new Date().toLocaleString(),
      totalStudents: stats.totalStudents,
      activeStudents: stats.activeStudents,
      pendingAdmins: stats.pendingRequests,
      totalAssessments: stats.totalAssessments,
      supportTickets: stats.openTickets,
      users: users
    }
    console.log('Report generated:', report)
    return report
  }

  return (
    <div className="dashboard admin-dashboard">
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
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard') }}
          >
            <i className="fas fa-home"></i> Dashboard
          </a>
          <a 
            href="#" 
            className={activeTab === 'pending-admins' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('pending-admins') }}
          >
            <i className="fas fa-user-clock"></i> Pending Admins
            {pendingAdmins.length > 0 && <span className="nav-badge">{pendingAdmins.length}</span>}
          </a>
          <a 
            href="#" 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('users') }}
          >
            <i className="fas fa-users"></i> Students
          </a>
          <a 
            href="#" 
            className={activeTab === 'manage-tests' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('manage-tests') }}
          >
            <i className="fas fa-clipboard-list"></i> Assessments
          </a>
          <a 
            href="#" 
            className={activeTab === 'support' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('support') }}
          >
            <i className="fas fa-headset"></i> Support
            {supportTickets.filter(t => t.status === 'open').length > 0 && 
              <span className="nav-badge">{supportTickets.filter(t => t.status === 'open').length}</span>
            }
          </a>
          <a 
            href="#" 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('reports') }}
          >
            <i className="fas fa-chart-bar"></i> Reports
          </a>
        </div>
        <div className="nav-right">
          <div className="notification-badge">
            <i className="fas fa-bell"></i>
            <span className="badge">{pendingAdmins.length + supportTickets.filter(t => t.status === 'open').length}</span>
          </div>
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