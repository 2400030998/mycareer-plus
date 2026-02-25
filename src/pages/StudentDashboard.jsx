import React, { useState, useEffect } from 'react'
import './Dashboard.css'

function StudentDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAssessment, setShowAssessment] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showProfile, setShowProfile] = useState(false)
  const [showJoinClass, setShowJoinClass] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [myClasses, setMyClasses] = useState([])
  const [classTests, setClassTests] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [testAnswers, setTestAnswers] = useState({})
  const [testResults, setTestResults] = useState({})
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    userType: 'student',
    phone: '',
    dob: '',
    education: '',
    certificates: [],
    joinDate: new Date().toLocaleDateString(),
    enrolledClasses: []
  })
  const [showCertificateUpload, setShowCertificateUpload] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showCounseling, setShowCounseling] = useState(false)
  const [activeCourse, setActiveCourse] = useState(null)
  const [courseProgress, setCourseProgress] = useState({})

  // Get user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData(prev => ({
        ...prev,
        name: parsedUser.name || 'Student',
        email: parsedUser.email || '',
        userType: parsedUser.userType || 'student',
        enrolledClasses: parsedUser.enrolledClasses || []
      }))
      
      // Load enrolled classes
      loadMyClasses(parsedUser.enrolledClasses || [])
    }
  }, [])

  const loadMyClasses = (enrolledIds) => {
    const allClasses = JSON.parse(localStorage.getItem('classes') || '[]')
    const userClasses = allClasses.filter(cls => enrolledIds.includes(cls.id))
    setMyClasses(userClasses)
  }

  // Handle Join Class
  const handleJoinClass = (e) => {
    e.preventDefault()
    const allClasses = JSON.parse(localStorage.getItem('classes') || '[]')
    const classToJoin = allClasses.find(cls => cls.classCode === classCode.toUpperCase())

    if (classToJoin) {
      // Check if already enrolled
      if (userData.enrolledClasses.includes(classToJoin.id)) {
        alert('You are already enrolled in this class!')
        return
      }

      // Update user's enrolled classes
      const updatedEnrolled = [...userData.enrolledClasses, classToJoin.id]
      const updatedUser = { ...userData, enrolledClasses: updatedEnrolled }
      
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
      // Update allUsers list
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
      const updatedUsers = allUsers.map(u => 
        u.email === userData.email ? { ...u, enrolledClasses: updatedEnrolled } : u
      )
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
      
      setUserData(updatedUser)
      loadMyClasses(updatedEnrolled)
      setShowJoinClass(false)
      setClassCode('')
      alert('Successfully joined class! 🎉')
    } else {
      alert('Invalid class code! Please check and try again.')
    }
  }

  // Load tests for selected class
  const loadClassTests = (classId) => {
    const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]')
    const classTests = allAssessments.filter(test => test.classId === classId)
    setClassTests(classTests)
  }

  // Handle Take Test
  const handleTakeTest = (test) => {
    setSelectedTest(test)
    setTestAnswers({})
    setCurrentQuestion(0)
  }

  // Handle Test Answer
  const handleTestAnswer = (questionIndex, answer) => {
    setTestAnswers({...testAnswers, [questionIndex]: answer})
  }

  // Handle Submit Test
  const handleSubmitTest = () => {
    // Calculate score
    let correct = 0
    const total = selectedTest.questions.length
    
    // For demo, random score
    correct = Math.floor(Math.random() * (total + 1))
    const percentage = Math.round((correct / total) * 100)
    
    const result = {
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      score: correct,
      total: total,
      percentage: percentage,
      date: new Date().toLocaleDateString(),
      answers: testAnswers
    }
    
    setTestResults({...testResults, [selectedTest.id]: result})
    setSelectedTest(null)
    alert(`Test submitted! Your score: ${correct}/${total} (${percentage}%)`)
  }

  // Sample assessments data
  const assessments = {
    career: {
      title: 'Career Assessment',
      icon: 'fa-clipboard-list',
      description: 'Discover careers matching your interests',
      questions: [
        'I enjoy working with people rather than data?',
        'I prefer creative tasks over routine work?',
        'I like to lead and manage teams?',
        'I enjoy solving complex problems?',
        'I prefer working outdoors rather than in an office?',
        'I am interested in technology and innovation?',
        'I enjoy helping and teaching others?',
        'I like to work with my hands?',
        'I prefer structured environment over flexible?',
        'I enjoy analyzing data and finding patterns?'
      ]
    },
    personality: {
      title: 'Personality Test',
      icon: 'fa-brain',
      description: 'Understand your personality type',
      questions: [
        'I am usually the one who starts conversations?',
        'I prefer to plan ahead rather than be spontaneous?',
        'I trust logic more than feelings?',
        'I enjoy being the center of attention?',
        'I get energized by social gatherings?',
        'I focus on details rather than big picture?',
        'I make decisions with heart rather than head?',
        'I prefer routine over variety?',
        'I am more practical than creative?',
        'I express my feelings openly?'
      ]
    },
    skills: {
      title: 'Skills Evaluation',
      icon: 'fa-chart-line',
      description: 'Identify your strengths and gaps',
      questions: [
        'How would you rate your communication skills?',
        'How comfortable are you with technology?',
        'How well do you work in a team?',
        'How are your problem-solving abilities?',
        'How would you rate your leadership skills?',
        'How good are you at time management?',
        'How well do you handle pressure?',
        'How are your analytical skills?',
        'How creative do you consider yourself?',
        'How would you rate your adaptability?'
      ]
    }
  }

  // Sample career recommendations
  const careerRecommendations = [
    {
      title: 'Software Developer',
      match: '95%',
      icon: 'fa-code',
      description: 'Design and build applications',
      salary: '$85k - $120k',
      demand: 'High Growth',
      skills: ['Programming', 'Problem Solving', 'Analytical'],
      color: '#6366f1'
    },
    {
      title: 'Data Scientist',
      match: '92%',
      icon: 'fa-chart-bar',
      description: 'Analyze data to drive decisions',
      salary: '$90k - $130k',
      demand: 'Very High Growth',
      skills: ['Statistics', 'Python', 'Machine Learning'],
      color: '#8b5cf6'
    },
    {
      title: 'UX Designer',
      match: '88%',
      icon: 'fa-paint-brush',
      description: 'Create user-friendly interfaces',
      salary: '$75k - $110k',
      demand: 'High Growth',
      skills: ['Design', 'User Research', 'Prototyping'],
      color: '#ec4899'
    },
    {
      title: 'Product Manager',
      match: '85%',
      icon: 'fa-tasks',
      description: 'Lead product development',
      salary: '$95k - $140k',
      demand: 'Very High Growth',
      skills: ['Leadership', 'Strategy', 'Communication'],
      color: '#f59e0b'
    },
    {
      title: 'Marketing Specialist',
      match: '82%',
      icon: 'fa-bullhorn',
      description: 'Create marketing campaigns',
      salary: '$60k - $90k',
      demand: 'Steady Growth',
      skills: ['Creativity', 'Analytics', 'Communication'],
      color: '#10b981'
    },
    {
      title: 'Financial Analyst',
      match: '80%',
      icon: 'fa-chart-pie',
      description: 'Analyze financial data',
      salary: '$70k - $100k',
      demand: 'Steady Growth',
      skills: ['Finance', 'Excel', 'Analysis'],
      color: '#3b82f6'
    }
  ]

  // 30 Days Career Counseling Plan
  const counselingPlans = {
    'web-development': {
      title: 'Web Development Career Track',
      icon: 'fa-code',
      color: '#6366f1',
      description: 'Learn to build modern websites and web applications',
      duration: '30 Days',
      modules: [
        { day: 1, title: 'HTML5 & CSS3 Basics', completed: false, video: 'https://youtu.be/example1', resources: ['HTML Cheat Sheet', 'CSS Reference'] },
        { day: 2, title: 'Responsive Design with Flexbox', completed: false, video: 'https://youtu.be/example2', resources: ['Flexbox Guide', 'Grid Tutorial'] },
        { day: 3, title: 'CSS Grid & Animations', completed: false, video: 'https://youtu.be/example3', resources: ['Animation Examples', 'Grid Practice'] },
        { day: 4, title: 'JavaScript Fundamentals', completed: false, video: 'https://youtu.be/example4', resources: ['JS Cheat Sheet', 'Practice Problems'] },
        { day: 5, title: 'DOM Manipulation', completed: false, video: 'https://youtu.be/example5', resources: ['DOM Guide', 'Event Handling'] },
        { day: 6, title: 'Project 1: Build a Portfolio Site', completed: false, video: 'https://youtu.be/example6', resources: ['Portfolio Examples'] },
        { day: 7, title: 'Quiz 1: HTML/CSS/JS Basics', completed: false, isQuiz: true },
        { day: 8, title: 'Introduction to React', completed: false, video: 'https://youtu.be/example7', resources: ['React Docs', 'Components Guide'] },
        { day: 9, title: 'React Components & Props', completed: false, video: 'https://youtu.be/example8', resources: ['Props Tutorial', 'Component Lifecycle'] },
        { day: 10, title: 'State & Hooks in React', completed: false, video: 'https://youtu.be/example9', resources: ['useState Guide', 'useEffect Examples'] },
        { day: 11, title: 'React Router & Navigation', completed: false, video: 'https://youtu.be/example10', resources: ['Router Docs', 'Navigation Examples'] },
        { day: 12, title: 'Project 2: Build a Todo App', completed: false, video: 'https://youtu.be/example11', resources: ['Todo App Guide'] },
        { day: 13, title: 'Quiz 2: React Basics', completed: false, isQuiz: true },
        { day: 14, title: 'Mid-Term Assessment', completed: false, isTest: true },
        { day: 15, title: 'Node.js & Express Basics', completed: false, video: 'https://youtu.be/example12', resources: ['Node Guide', 'Express Tutorial'] },
        { day: 16, title: 'REST APIs & MongoDB', completed: false, video: 'https://youtu.be/example13', resources: ['API Design', 'MongoDB Guide'] },
        { day: 17, title: 'Authentication & Authorization', completed: false, video: 'https://youtu.be/example14', resources: ['JWT Tutorial', 'Security Best Practices'] },
        { day: 18, title: 'Full Stack Integration', completed: false, video: 'https://youtu.be/example15', resources: ['Integration Guide'] },
        { day: 19, title: 'Project 3: Build a Blog App', completed: false, video: 'https://youtu.be/example16', resources: ['Blog Tutorial'] },
        { day: 20, title: 'Quiz 3: Backend Basics', completed: false, isQuiz: true },
        { day: 21, title: 'Version Control with Git', completed: false, video: 'https://youtu.be/example17', resources: ['Git Guide', 'GitHub Tutorial'] },
        { day: 22, title: 'Deployment & Hosting', completed: false, video: 'https://youtu.be/example18', resources: ['Netlify Guide', 'Vercel Tutorial'] },
        { day: 23, title: 'Performance Optimization', completed: false, video: 'https://youtu.be/example19', resources: ['Optimization Tips'] },
        { day: 24, title: 'Testing & Debugging', completed: false, video: 'https://youtu.be/example20', resources: ['Testing Guide'] },
        { day: 25, title: 'Project 4: E-commerce Site', completed: false, video: 'https://youtu.be/example21', resources: ['E-commerce Tutorial'] },
        { day: 26, title: 'Quiz 4: Advanced Topics', completed: false, isQuiz: true },
        { day: 27, title: 'Career Preparation: Resume & Portfolio', completed: false, video: 'https://youtu.be/example22', resources: ['Resume Template', 'Portfolio Tips'] },
        { day: 28, title: 'Mock Interviews & Communication', completed: false, video: 'https://youtu.be/example23', resources: ['Interview Questions'] },
        { day: 29, title: 'Final Project: Capstone', completed: false, video: 'https://youtu.be/example24', resources: ['Project Requirements'] },
        { day: 30, title: 'Final Assessment & Certification', completed: false, isTest: true }
      ]
    },
    'data-science': {
      title: 'Data Science Career Track',
      icon: 'fa-chart-bar',
      color: '#8b5cf6',
      description: 'Master data analysis, machine learning, and AI',
      duration: '30 Days',
      modules: [
        { day: 1, title: 'Python Basics', completed: false, video: 'https://youtu.be/example25', resources: ['Python Guide'] },
        { day: 2, title: 'NumPy & Pandas', completed: false, video: 'https://youtu.be/example26', resources: ['NumPy Tutorial', 'Pandas Guide'] },
        { day: 3, title: 'Data Visualization', completed: false, video: 'https://youtu.be/example27', resources: ['Matplotlib', 'Seaborn'] }
      ]
    },
    'digital-marketing': {
      title: 'Digital Marketing Career Track',
      icon: 'fa-bullhorn',
      color: '#10b981',
      description: 'Learn SEO, social media, and analytics',
      duration: '30 Days',
      modules: [
        { day: 1, title: 'Marketing Fundamentals', completed: false, video: 'https://youtu.be/example28', resources: ['Marketing Guide'] }
      ]
    }
  }

  // Quiz questions for assessments
  const quizQuestions = [
    {
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
      correct: 0
    },
    {
      question: 'Which CSS property is used to change the text color?',
      options: ['text-color', 'font-color', 'color', 'text-style'],
      correct: 2
    },
    {
      question: 'What is React?',
      options: ['A database', 'A JavaScript library', 'A programming language', 'An operating system'],
      correct: 1
    },
    {
      question: 'What does API stand for?',
      options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Integration', 'Automated Program Interaction'],
      correct: 0
    },
    {
      question: 'Which method is used to add elements to the end of an array in JavaScript?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correct: 0
    }
  ]

  // Sample results
  const [results, setResults] = useState({
    career: 'Software Developer',
    personality: 'INTJ (Architect)',
    skills: ['Communication', 'Problem Solving', 'Leadership']
  })

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({...answers, [questionIndex]: answer})
  }

  const nextQuestion = () => {
    if (currentQuestion < assessments[showAssessment].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit assessment
      alert('Assessment completed! View your results.')
      setShowAssessment(null)
      setCurrentQuestion(0)
      setAnswers({})
    }
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Update user data
    localStorage.setItem('currentUser', JSON.stringify(userData))
    alert('Profile updated successfully!')
    setShowProfile(false)
  }

  const handleCertificateUpload = (e) => {
    e.preventDefault()
    if (selectedFile) {
      const newCertificate = {
        name: selectedFile.name,
        date: new Date().toLocaleDateString(),
        file: URL.createObjectURL(selectedFile)
      }
      setUserData({
        ...userData,
        certificates: [...userData.certificates, newCertificate]
      })
      setSelectedFile(null)
      setShowCertificateUpload(false)
      alert('Certificate uploaded successfully!')
    }
  }

  const handleQuizSubmit = (quizIndex, answers) => {
    // Calculate score
    let score = 0
    answers.forEach((ans, idx) => {
      if (ans === quizQuestions[idx].correct) score++
    })
    alert(`Quiz completed! Your score: ${score}/${quizQuestions.length}`)
  }

  const handleTestSubmit = (testId, answers) => {
    // Submit test and show results
    alert('Test submitted! Check your results in the Results section.')
  }

  const toggleDayComplete = (courseId, dayIndex) => {
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [dayIndex]: !prev[courseId]?.[dayIndex]
      }
    }))
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-home">
            {/* Welcome Banner with User Name */}
            <div className="welcome-banner">
              <div className="welcome-text">
                <h2>Welcome back, {userData.name}! 👋</h2>
                <p>Ready to discover your perfect career path?</p>
              </div>
              <div className="welcome-stats">
                <div className="stat-chip">
                  <i className="fas fa-trophy"></i>
                  <span>{myClasses.length} Classes Joined</span>
                </div>
                <div className="stat-chip">
                  <i className="fas fa-bullseye"></i>
                  <span>{Object.keys(testResults).length} Tests Taken</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <div className="action-card" onClick={() => setShowJoinClass(true)}>
                  <i className="fas fa-door-open"></i>
                  <span>Join Class</span>
                  <small>Enter class code</small>
                </div>
                <div className="action-card" onClick={() => setActiveTab('myclasses')}>
                  <i className="fas fa-school"></i>
                  <span>My Classes</span>
                  <small>{myClasses.length} classes</small>
                </div>
                <div className="action-card" onClick={() => setActiveTab('assessments')}>
                  <i className="fas fa-clipboard-list"></i>
                  <span>Take Assessment</span>
                </div>
                <div className="action-card" onClick={() => setShowCounseling(true)}>
                  <i className="fas fa-calendar-alt"></i>
                  <span>30-Day Career Plan</span>
                </div>
              </div>
            </div>

            {/* My Classes Preview */}
            {myClasses.length > 0 && (
              <div className="preview-section">
                <div className="section-header">
                  <h3>My Classes</h3>
                  <button className="view-all" onClick={() => setActiveTab('myclasses')}>
                    View All <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                <div className="classes-preview-grid">
                  {myClasses.slice(0, 3).map(cls => (
                    <div key={cls.id} className="class-preview-card">
                      <div className="class-preview-header">
                        <i className="fas fa-school" style={{color: '#6366f1'}}></i>
                        <span className="class-code-tag">{cls.classCode}</span>
                      </div>
                      <h4>{cls.className}</h4>
                      <p>{cls.subject} - {cls.section}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Careers Preview */}
            <div className="preview-section">
              <div className="section-header">
                <h3>Recommended for You</h3>
                <button className="view-all" onClick={() => setActiveTab('careers')}>
                  View All <i className="fas fa-arrow-right"></i>
                </button>
              </div>
              <div className="careers-preview-grid">
                {careerRecommendations.slice(0, 3).map((career, index) => (
                  <div key={index} className="career-preview-card">
                    <div className="preview-icon" style={{background: `${career.color}20`}}>
                      <i className={`fas ${career.icon}`} style={{color: career.color}}></i>
                    </div>
                    <div className="preview-info">
                      <h4>{career.title}</h4>
                      <span className="match-badge">{career.match} Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
              <h3>Recent Activity</h3>
              <div className="activity-timeline">
                <div className="activity-item">
                  <i className="fas fa-check-circle" style={{color: '#10b981'}}></i>
                  <div>
                    <p>Completed Career Assessment</p>
                    <span>2 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <i className="fas fa-clock" style={{color: '#f59e0b'}}></i>
                  <div>
                    <p>Personality Test in progress</p>
                    <span>5 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <i className="fas fa-star" style={{color: '#6366f1'}}></i>
                  <div>
                    <p>New career matches available</p>
                    <span>1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'myclasses':
        return (
          <div className="myclasses-page">
            <div className="page-header">
              <h2>My Classes</h2>
              <button className="join-class-btn" onClick={() => setShowJoinClass(true)}>
                <i className="fas fa-plus"></i> Join New Class
              </button>
            </div>

            {myClasses.length > 0 ? (
              <div className="classes-grid">
                {myClasses.map(cls => {
                  // Load tests for this class
                  const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]')
                  const classTests = allAssessments.filter(test => test.classId === cls.id)
                  
                  return (
                    <div key={cls.id} className="class-card">
                      <div className="class-header">
                        <div>
                          <span className="class-code">{cls.classCode}</span>
                          <h3>{cls.className}</h3>
                        </div>
                      </div>
                      <p className="class-desc">{cls.subject} - Section {cls.section}</p>
                      <div className="class-meta">
                        <span><i className="fas fa-calendar"></i> {cls.academicYear}</span>
                      </div>
                      
                      {/* Class Tests */}
                      <div className="class-tests">
                        <h4>Available Tests</h4>
                        {classTests.length > 0 ? (
                          classTests.map(test => (
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
                                <button 
                                  className="take-test-btn"
                                  onClick={() => handleTakeTest(test)}
                                >
                                  Take Test
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="no-tests">No tests available yet</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="no-classes">
                <i className="fas fa-school"></i>
                <h3>No Classes Joined</h3>
                <p>Click "Join New Class" and enter your class code to get started!</p>
              </div>
            )}
          </div>
        )

      case 'assessments':
        return (
          <div className="assessments-page">
            <h2>Career Assessments</h2>
            <p className="page-description">Choose an assessment to start your journey</p>
            
            {showAssessment ? (
              <div className="assessment-taking">
                <button className="back-btn" onClick={() => {
                  setShowAssessment(null)
                  setCurrentQuestion(0)
                  setAnswers({})
                }}>
                  <i className="fas fa-arrow-left"></i> Back to Assessments
                </button>
                
                <div className="assessment-header">
                  <div className="assessment-title">
                    <i className={`fas ${assessments[showAssessment].icon}`}></i>
                    <h3>{assessments[showAssessment].title}</h3>
                  </div>
                  <div className="progress-indicator">
                    Question {currentQuestion + 1} of {assessments[showAssessment].questions.length}
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${((currentQuestion + 1) / assessments[showAssessment].questions.length) * 100}%`
                  }}></div>
                </div>

                <div className="question-container">
                  <h4>{assessments[showAssessment].questions[currentQuestion]}</h4>
                  
                  <div className="options-grid">
                    {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((option, idx) => (
                      <button
                        key={idx}
                        className={`option-btn ${answers[currentQuestion] === option ? 'selected' : ''}`}
                        onClick={() => handleAnswer(currentQuestion, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="next-btn"
                    onClick={nextQuestion}
                    disabled={!answers[currentQuestion]}
                  >
                    {currentQuestion === assessments[showAssessment].questions.length - 1 
                      ? 'Submit Assessment' 
                      : 'Next Question'}
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="assessments-grid">
                {Object.keys(assessments).map((key) => (
                  <div key={key} className="assessment-card" onClick={() => setShowAssessment(key)}>
                    <div className="card-icon">
                      <i className={`fas ${assessments[key].icon}`}></i>
                    </div>
                    <h3>{assessments[key].title}</h3>
                    <p>{assessments[key].description}</p>
                    <div className="card-footer">
                      <span className="question-count">
                        <i className="far fa-clock"></i> 10 mins
                      </span>
                      <button className="start-btn">
                        Start <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'results':
        return (
          <div className="results-page">
            <h2>Your Assessment Results</h2>
            <p className="page-description">Based on your responses, here's what we found</p>

            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <h3>Career Match</h3>
                <div className="result-value">{results.career}</div>
                <div className="result-detail">Top recommendation based on your interests</div>
              </div>

              <div className="result-card">
                <div className="result-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h3>Personality Type</h3>
                <div className="result-value">{results.personality}</div>
                <div className="result-detail">Architect - Imaginative and strategic thinkers</div>
              </div>

              <div className="result-card">
                <div className="result-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Top Skills</h3>
                <div className="skills-list">
                  {results.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <button className="view-details-btn" onClick={() => setActiveTab('careers')}>
                  View Career Matches <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="test-results-section">
                <h3>Class Test Results</h3>
                <div className="test-results-grid">
                  {Object.values(testResults).map((result, idx) => (
                    <div key={idx} className="test-result-card">
                      <h4>{result.testTitle}</h4>
                      <div className="score-circle">
                        <span className="score">{result.percentage}%</span>
                      </div>
                      <p>Score: {result.score}/{result.total}</p>
                      <small>Completed: {result.date}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="recommendation-box">
              <h3>Next Steps</h3>
              <p>Based on your results, we recommend exploring careers in technology and design.</p>
              <button className="explore-btn" onClick={() => setActiveTab('careers')}>
                Explore Recommended Careers
              </button>
            </div>
          </div>
        )

      case 'careers':
        return (
          <div className="careers-page">
            <h2>Career Recommendations</h2>
            <p className="page-description">Careers matched to your profile</p>

            <div className="filters-bar">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Technology</button>
              <button className="filter-btn">Business</button>
              <button className="filter-btn">Creative</button>
              <button className="filter-btn">Science</button>
            </div>

            <div className="careers-grid">
              {careerRecommendations.map((career, index) => (
                <div key={index} className="career-card">
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
                    <button className="learn-more-btn">
                      Learn More <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard">
      {/* Join Class Modal */}
      {showJoinClass && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowJoinClass(false)}>&times;</span>
            <div className="modal-header">
              <i className="fas fa-door-open modal-logo"></i>
              <h2>Join a Class</h2>
              <p>Enter the 6-digit class code provided by your teacher</p>
            </div>
            <form onSubmit={handleJoinClass}>
              <div className="form-group">
                <label><i className="fas fa-key"></i> Class Code</label>
                <input 
                  type="text" 
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC123"
                  maxLength="6"
                  required
                  className="class-code-input"
                />
              </div>
              <button type="submit" className="btn-submit">
                Join Class <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Take Test Modal */}
      {selectedTest && (
        <div className="modal test-modal">
          <div className="modal-content test-content">
            <span className="close" onClick={() => setSelectedTest(null)}>&times;</span>
            <div className="test-header">
              <h2>{selectedTest.title}</h2>
              <span className="test-progress">Question {currentQuestion + 1}/{selectedTest.questions.length}</span>
            </div>
            
            <div className="test-progress-bar">
              <div className="progress-fill" style={{
                width: `${((currentQuestion + 1) / selectedTest.questions.length) * 100}%`
              }}></div>
            </div>

            <div className="test-question">
              <h3>{selectedTest.questions[currentQuestion]}</h3>
              
              <div className="test-options">
                {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((option, idx) => (
                  <button
                    key={idx}
                    className={`test-option ${testAnswers[currentQuestion] === option ? 'selected' : ''}`}
                    onClick={() => handleTestAnswer(currentQuestion, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="test-footer">
              <button 
                className="next-test-btn"
                onClick={() => {
                  if (currentQuestion < selectedTest.questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1)
                  } else {
                    handleSubmitTest()
                  }
                }}
                disabled={!testAnswers[currentQuestion]}
              >
                {currentQuestion === selectedTest.questions.length - 1 ? 'Submit Test' : 'Next Question'}
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <button className="close-modal" onClick={() => setShowProfile(false)}>×</button>
            <h2>My Profile</h2>
            
            <div className="profile-header">
              <div className="profile-avatar">
                <img src={`https://ui-avatars.com/api/?name=${userData.name}&background=6366f1&color=fff&size=128`} alt={userData.name} />
              </div>
              <div className="profile-title">
                <h3>{userData.name}</h3>
                <p>{userData.email}</p>
                <span className="badge-student">Student</span>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-user"></i> Full Name</label>
                  <input 
                    type="text" 
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-envelope"></i> Email</label>
                  <input 
                    type="email" 
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><i className="fas fa-phone"></i> Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-calendar"></i> Date of Birth</label>
                  <input 
                    type="date" 
                    value={userData.dob}
                    onChange={(e) => setUserData({...userData, dob: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label><i className="fas fa-graduation-cap"></i> Education</label>
                <input 
                  type="text" 
                  placeholder="e.g., B.Tech Computer Science, 3rd Year"
                  value={userData.education}
                  onChange={(e) => setUserData({...userData, education: e.target.value})}
                />
              </div>

              <div className="certificates-section">
                <h4>Certificates <button type="button" className="add-btn" onClick={() => setShowCertificateUpload(true)}><i className="fas fa-plus"></i> Add</button></h4>
                {userData.certificates.length > 0 ? (
                  <div className="certificates-list">
                    {userData.certificates.map((cert, idx) => (
                      <div key={idx} className="certificate-item">
                        <i className="fas fa-certificate"></i>
                        <div>
                          <p>{cert.name}</p>
                          <small>Uploaded: {cert.date}</small>
                        </div>
                        <a href={cert.file} target="_blank" rel="noopener noreferrer" className="view-cert">View</a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-certificates">No certificates uploaded yet</p>
                )}
              </div>

              <div className="profile-actions">
                <button type="submit" className="save-profile-btn">
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowProfile(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Upload Modal */}
      {showCertificateUpload && (
        <div className="cert-upload-modal">
          <div className="cert-upload-content">
            <h3>Upload Certificate</h3>
            <form onSubmit={handleCertificateUpload}>
              <div className="upload-area">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop or click to browse</p>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                />
              </div>
              {selectedFile && (
                <p className="selected-file">Selected: {selectedFile.name}</p>
              )}
              <div className="upload-actions">
                <button type="submit" className="upload-btn" disabled={!selectedFile}>
                  <i className="fas fa-upload"></i> Upload
                </button>
                <button type="button" className="cancel-upload-btn" onClick={() => setShowCertificateUpload(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Career Counseling Modal - 30 Day Plan */}
      {showCounseling && (
        <div className="counseling-modal">
          <div className="counseling-modal-content">
            <button className="close-modal" onClick={() => setShowCounseling(false)}>×</button>
            <h2>30-Day Career Acceleration Plan</h2>
            <p className="modal-description">Choose a track and start your journey to a successful career</p>

            <div className="tracks-grid">
              {Object.keys(counselingPlans).map((key) => (
                <div 
                  key={key} 
                  className={`track-card ${activeCourse === key ? 'active' : ''}`}
                  onClick={() => setActiveCourse(activeCourse === key ? null : key)}
                >
                  <div className="track-icon" style={{background: counselingPlans[key].color}}>
                    <i className={`fas ${counselingPlans[key].icon}`}></i>
                  </div>
                  <h3>{counselingPlans[key].title}</h3>
                  <p>{counselingPlans[key].description}</p>
                  <span className="track-duration"><i className="far fa-clock"></i> {counselingPlans[key].duration}</span>
                </div>
              ))}
            </div>

            {activeCourse && (
              <div className="course-detail">
                <h3>{counselingPlans[activeCourse].title} - 30 Day Plan</h3>
                <div className="progress-summary">
                  <div className="progress-stat">
                    <span className="stat-label">Progress</span>
                    <span className="stat-value">
                      {Object.keys(courseProgress[activeCourse] || {}).filter(day => courseProgress[activeCourse][day]).length} / 30 days
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${(Object.keys(courseProgress[activeCourse] || {}).filter(day => courseProgress[activeCourse][day]).length / 30) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="modules-timeline">
                  {counselingPlans[activeCourse].modules.map((module, idx) => (
                    <div key={idx} className={`module-item ${module.completed ? 'completed' : ''}`}>
                      <div className="module-day">Day {module.day}</div>
                      <div className="module-content">
                        <h4>{module.title}</h4>
                        {module.video && (
                          <a href={module.video} target="_blank" rel="noopener noreferrer" className="video-link">
                            <i className="fab fa-youtube"></i> Watch Video
                          </a>
                        )}
                        {module.resources && (
                          <div className="resources">
                            {module.resources.map((res, i) => (
                              <span key={i} className="resource-tag">{res}</span>
                            ))}
                          </div>
                        )}
                        {module.isQuiz && (
                          <button className="take-quiz-btn" onClick={() => handleQuizSubmit(idx, [])}>
                            Take Quiz <i className="fas fa-arrow-right"></i>
                          </button>
                        )}
                        {module.isTest && (
                          <button className="take-test-btn" onClick={() => handleTestSubmit(idx, [])}>
                            Take Test <i className="fas fa-arrow-right"></i>
                          </button>
                        )}
                      </div>
                      <button 
                        className={`complete-btn ${courseProgress[activeCourse]?.[idx] ? 'completed' : ''}`}
                        onClick={() => toggleDayComplete(activeCourse, idx)}
                      >
                        {courseProgress[activeCourse]?.[idx] ? <i className="fas fa-check-circle"></i> : <i className="far fa-circle"></i>}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="course-actions">
                  <button className="start-course-btn">
                    <i className="fas fa-play"></i> Continue Learning
                  </button>
                  <button className="download-plan-btn">
                    <i className="fas fa-download"></i> Download Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="dashboard-nav">
        <div className="logo">
          <i className="fas fa-compass"></i>
          <span>MyCareer<span className="logo-highlight">+</span></span>
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
            className={activeTab === 'myclasses' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('myclasses') }}
          >
            <i className="fas fa-school"></i> My Classes
            {myClasses.length > 0 && <span className="nav-badge">{myClasses.length}</span>}
          </a>
          <a 
            href="#" 
            className={activeTab === 'assessments' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('assessments') }}
          >
            <i className="fas fa-clipboard-list"></i> Assessments
          </a>
          <a 
            href="#" 
            className={activeTab === 'results' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('results') }}
          >
            <i className="fas fa-chart-pie"></i> Results
          </a>
          <a 
            href="#" 
            className={activeTab === 'careers' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); setActiveTab('careers') }}
          >
            <i className="fas fa-briefcase"></i> Careers
          </a>
        </div>
        <div className="nav-right">
          <div className="notification-badge">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
          <div className="profile-mini" onClick={() => setShowProfile(true)}>
            <img src={`https://ui-avatars.com/api/?name=${userData.name}&background=6366f1&color=fff`} alt={userData.name} />
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

export default StudentDashboard