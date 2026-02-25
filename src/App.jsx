import React, { useState, useEffect } from 'react'
import './App.css'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [userType, setUserType] = useState('student')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUserType, setLoggedInUserType] = useState(null)
  const [showSuccess, setShowSuccess] = useState('')

  // Create default super admin if not exists
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    
    // Check if super admin exists
    const superAdminExists = allUsers.some(u => u.email === 'admin@mycareerplus.com')
    
    if (!superAdminExists) {
      // Create default super admin
      const superAdmin = {
        name: 'Super Admin',
        email: 'admin@mycareerplus.com',
        password: 'admin123',
        phone: '1234567890',
        department: 'Administration',
        userType: 'admin',
        status: 'active',
        isSuperAdmin: true,
        joinDate: new Date().toLocaleDateString(),
        id: Date.now(),
        lastActive: new Date().toLocaleDateString(),
        approvedBy: 'System',
        approvedDate: new Date().toLocaleDateString()
      }
      
      allUsers.push(superAdmin)
      localStorage.setItem('allUsers', JSON.stringify(allUsers))
      console.log('Default super admin created')
    }
  }, [])

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value

    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]')
    
    // Find user
    const user = allUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Check if user is active
      if (user.status === 'inactive') {
        setShowSuccess('Your account is inactive. Contact admin.')
        setTimeout(() => setShowSuccess(''), 2000)
        return
      }

      // Store current user
      // Get existing users
let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');

// Create super admin
const superAdmin = {
  name: 'Super Admin',
  email: 'admin@mycareerplus.com',
  password: 'admin123',
  phone: '1234567890',
  department: 'Administration',
  userType: 'admin',
  status: 'active',
  isSuperAdmin: true,
  joinDate: new Date().toLocaleDateString(),
  id: Date.now(),
  lastActive: new Date().toLocaleDateString(),
  approvedBy: 'System',
  approvedDate: new Date().toLocaleDateString()
};

// Add to users
allUsers.push(superAdmin);

// Save back to localStorage
localStorage.setItem('allUsers', JSON.stringify(allUsers));

console.log('✅ Super Admin created!');
console.log('Email: admin@mycareerplus.com');
console.log('Password: admin123');

      localStorage.setItem('currentUser', JSON.stringify(user))
      
      setShowSuccess('Login Successful! Redirecting...')
      setTimeout(() => {
        setShowLogin(false)
        setIsLoggedIn(true)
        setLoggedInUserType(user.userType)
        setShowSuccess('')
      }, 1500)
    } else {
      // Check if pending admin
      const pending = pendingAdmins.find(p => p.email === email)
      if (pending) {
        setShowSuccess('Your admin request is pending approval. Please wait.')
      } else {
        setShowSuccess('Invalid email or password!')
      }
      setTimeout(() => setShowSuccess(''), 2000)
    }
  }

  // Handle Signup
  const handleSignup = (e) => {
    e.preventDefault()
    
    const name = document.getElementById('signupName').value
    const email = document.getElementById('signupEmail').value
    const password = document.getElementById('signupPassword').value
    const phone = document.getElementById('signupPhone')?.value || ''
    const department = document.getElementById('signupDepartment')?.value || ''
    const reason = document.getElementById('signupReason')?.value || ''
    const idCard = document.getElementById('signupIdCard')?.files[0]

    const userData = {
      name,
      email,
      password,
      phone,
      department,
      reason,
      userType: userType,
      joinDate: new Date().toLocaleDateString(),
      id: Date.now(),
      lastActive: new Date().toLocaleDateString()
    }

    if (userType === 'student') {
      // Student: Direct registration
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
      
      // Check if email already exists
      if (allUsers.some(u => u.email === email)) {
        setShowSuccess('Email already exists! Please login.')
        setTimeout(() => setShowSuccess(''), 2000)
        return
      }

      // Add student with active status
      const newStudent = {
        ...userData,
        status: 'active',
        certificates: [],
        education: ''
      }
      
      allUsers.push(newStudent)
      localStorage.setItem('allUsers', JSON.stringify(allUsers))
      
      setShowSuccess('Account Created Successfully! Please Login...')
      setTimeout(() => {
        setShowSignup(false)
        setShowLogin(true)
        setShowSuccess('')
        // Reset form
        document.getElementById('signupName').value = ''
        document.getElementById('signupEmail').value = ''
        document.getElementById('signupPassword').value = ''
        document.getElementById('signupPhone').value = ''
      }, 1500)
    } else {
      // Admin: Add to pending requests with ID card
      const pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]')
      
      // Check if already requested
      if (pendingAdmins.some(p => p.email === email)) {
        setShowSuccess('Request already pending! Please wait for approval.')
        setTimeout(() => setShowSuccess(''), 2000)
        return
      }

      // Check if already an admin
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
      if (allUsers.some(u => u.email === email && u.userType === 'admin')) {
        setShowSuccess('You are already an admin! Please login.')
        setTimeout(() => setShowSuccess(''), 2000)
        return
      }

      // Handle ID card upload (store as base64 for demo)
      let idCardData = null
      if (idCard) {
        const reader = new FileReader()
        reader.onloadend = () => {
          idCardData = reader.result
          
          // Add to pending with ID card
          const pendingRequest = {
            ...userData,
            idCard: idCardData,
            idCardName: idCard.name,
            requestDate: new Date().toLocaleDateString(),
            status: 'pending'
          }
          
          pendingAdmins.push(pendingRequest)
          localStorage.setItem('pendingAdmins', JSON.stringify(pendingAdmins))
          
          setShowSuccess('Admin request sent with ID card! You will be notified once approved.')
          setTimeout(() => {
            setShowSignup(false)
            setShowSuccess('')
            // Reset form
            document.getElementById('signupName').value = ''
            document.getElementById('signupEmail').value = ''
            document.getElementById('signupPassword').value = ''
            document.getElementById('signupPhone').value = ''
            document.getElementById('signupDepartment').value = ''
            document.getElementById('signupReason').value = ''
            document.getElementById('signupIdCard').value = ''
          }, 2000)
        }
        reader.readAsDataURL(idCard)
      } else {
        // Add to pending without ID card
        const pendingRequest = {
          ...userData,
          idCard: null,
          requestDate: new Date().toLocaleDateString(),
          status: 'pending'
        }
        
        pendingAdmins.push(pendingRequest)
        localStorage.setItem('pendingAdmins', JSON.stringify(pendingAdmins))
        
        setShowSuccess('Admin request sent! Please upload ID card later.')
        setTimeout(() => {
          setShowSignup(false)
          setShowSuccess('')
          // Reset form
          document.getElementById('signupName').value = ''
          document.getElementById('signupEmail').value = ''
          document.getElementById('signupPassword').value = ''
          document.getElementById('signupPhone').value = ''
          document.getElementById('signupDepartment').value = ''
          document.getElementById('signupReason').value = ''
        }, 2000)
      }
    }
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
    setLoggedInUserType(null)
  }

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      setIsLoggedIn(true)
      setLoggedInUserType(currentUser.userType)
    }
  }, [])

  // If logged in as Student
  if (isLoggedIn && loggedInUserType === 'student') {
    return <StudentDashboard onLogout={handleLogout} />
  }

  // If logged in as Admin
  if (isLoggedIn && loggedInUserType === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return (
    <div className="app">
      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          {showSuccess}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <i className="fas fa-compass"></i>
            <span>MyCareer<span className="logo-highlight">+</span></span>
          </div>
          
          <ul className="nav-menu">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about">About</a></li>
          </ul>

          <div className="nav-buttons">
            <button className="btn-login" onClick={() => setShowLogin(true)}>Login</button>
            <button className="btn-signup" onClick={() => setShowSignup(true)}>Sign Up Free</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge">🚀 AI-Powered Career Guidance</span>
            <h1>Discover Your Perfect <span className="gradient-text">Career Path</span></h1>
            <p>Take smart assessments, understand your strengths, and get personalized career recommendations with MyCareer+</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => setShowSignup(true)}>
                Get Started <i className="fas fa-arrow-right"></i>
              </button>
              <button className="btn-secondary">
                Watch Demo <i className="fas fa-play"></i>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card">
              <div className="assessment-preview">
                <div className="preview-header">
                  <i className="fas fa-clipboard-check"></i>
                  <span>Career Assessment</span>
                </div>
                <div className="preview-questions">
                  <div className="preview-question">
                    <span className="q-num">1/10</span>
                    <div className="q-progress">
                      <div className="q-progress-fill" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  <p className="q-text">I enjoy working with people rather than data?</p>
                  <div className="q-options">
                    <span className="q-option">Strongly Agree</span>
                    <span className="q-option">Agree</span>
                    <span className="q-option">Neutral</span>
                  </div>
                </div>
                <div className="preview-footer">
                  <span className="preview-tag">Interactive</span>
                  <span className="preview-time"><i className="far fa-clock"></i> 10 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">FEATURES</span>
            <h2>Everything You Need to <span className="gradient-text">Shape Your Future</span></h2>
            <p>Comprehensive tools to help you make informed career decisions</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h3>Career Assessments</h3>
              <p>Take intelligent tests that analyze your interests, aptitude, and skills</p>
              <div className="feature-hover">
                <span>Try Now <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Personality Tests</h3>
              <p>Understand your personality type and how it aligns with different careers</p>
              <div className="feature-hover">
                <span>Discover <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Skills Evaluation</h3>
              <p>Identify your strengths and areas for improvement with detailed analysis</p>
              <div className="feature-hover">
                <span>Evaluate <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Career Matching</h3>
              <p>Get personalized career recommendations based on your unique profile</p>
              <div className="feature-hover">
                <span>Explore <i className="fas fa-arrow-right"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-container">
          <div className="section-header">
            <span className="section-badge">PROCESS</span>
            <h2>Three Simple Steps to <span className="gradient-text">Your Career</span></h2>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Take Assessments</h3>
                <p>Complete our career, personality, and skills assessments (15-20 mins)</p>
                <div className="step-features">
                  <span><i className="fas fa-check-circle"></i> Career Test</span>
                  <span><i className="fas fa-check-circle"></i> Personality Test</span>
                  <span><i className="fas fa-check-circle"></i> Skills Test</span>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Get Analysis</h3>
                <p>Receive detailed insights about your strengths, preferences, and potential</p>
                <div className="step-features">
                  <span><i className="fas fa-chart-pie"></i> Strength Analysis</span>
                  <span><i className="fas fa-star"></i> Personality Type</span>
                  <span><i className="fas fa-tachometer-alt"></i> Skill Gaps</span>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Explore Careers</h3>
                <p>Discover matched career paths with salary info, requirements, and growth</p>
                <div className="step-features">
                  <span><i className="fas fa-briefcase"></i> Career Matches</span>
                  <span><i className="fas fa-graduation-cap"></i> Education Path</span>
                  <span><i className="fas fa-chart-bar"></i> Growth Outlook</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-box">
            <h3>Ready to discover your perfect career?</h3>
            <p>Join thousands of students who found their path with MyCareer+</p>
            <button className="btn-primary" onClick={() => setShowSignup(true)}>
              Start Your Journey <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="about-content">
            <span className="section-badge">ABOUT US</span>
            <h2>Empowering Students to <span className="gradient-text">Find Their Path</span></h2>
            <p>MyCareer+ uses advanced algorithms and career counseling principles to help students discover careers that match their unique personality, skills, and interests.</p>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students Guided</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">50+</span>
                <span className="stat-label">Career Paths</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src="https://illustrations.popsy.co/white/team-spirit.svg" alt="About Us" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <i className="fas fa-compass"></i>
                <span>MyCareer<span className="logo-highlight">+</span></span>
              </div>
              <p>Empowering students to discover and pursue their dream careers through smart assessments and personalized guidance.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#about">About Us</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Assessments</h4>
              <ul>
                <li><a href="#">Career Test</a></li>
                <li><a href="#">Personality Test</a></li>
                <li><a href="#">Skills Test</a></li>
                <li><a href="#">Interest Test</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li><i className="fas fa-envelope"></i> mycareerplus@help.com</li>
                <li><i className="fas fa-envelope"></i> support@mycareerplus.com</li>
                <li><i className="fas fa-phone"></i> +1 (800) 123-4567</li>
                <li><i className="fas fa-map-marker-alt"></i> 123 Career Street, Education City, EC 12345</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 MyCareer+. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowLogin(false)}>&times;</span>
            <div className="modal-header">
              <i className="fas fa-compass modal-logo"></i>
              <h2>Welcome Back!</h2>
              <p>Login to continue your journey</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label><i className="fas fa-envelope"></i> Email</label>
                <input 
                  type="email" 
                  id="loginEmail"
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-lock"></i> Password</label>
                <input 
                  type="password" 
                  id="loginPassword"
                  placeholder="Enter your password" 
                  required 
                />
              </div>
              <button type="submit" className="btn-submit">
                Login <i className="fas fa-arrow-right"></i>
              </button>
            </form>
            <p className="modal-footer">
              Don't have an account? <a href="#" onClick={(e) => {
                e.preventDefault()
                setShowLogin(false)
                setShowSignup(true)
              }}>Sign up</a>
            </p>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSignup(false)}>&times;</span>
            <div className="modal-header">
              <i className="fas fa-compass modal-logo"></i>
              <h2>Start Your Journey</h2>
              <p>Create your free account</p>
            </div>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label><i className="fas fa-user"></i> Full Name</label>
                <input 
                  type="text" 
                  id="signupName"
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-envelope"></i> Email</label>
                <input 
                  type="email" 
                  id="signupEmail"
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-lock"></i> Password</label>
                <input 
                  type="password" 
                  id="signupPassword"
                  placeholder="Create a password" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-phone"></i> Phone Number</label>
                <input 
                  type="tel" 
                  id="signupPhone"
                  placeholder="Enter your phone number" 
                />
              </div>
              <div className="user-type-selector">
                <p>I am a:</p>
                <div className="user-type-buttons">
                  <button 
                    type="button" 
                    className={`user-type-btn student-btn ${userType === 'student' ? 'active' : ''}`}
                    onClick={() => setUserType('student')}
                  >
                    <i className="fas fa-user-graduate"></i> Student
                  </button>
                  <button 
                    type="button" 
                    className={`user-type-btn admin-btn ${userType === 'admin' ? 'active' : ''}`}
                    onClick={() => setUserType('admin')}
                  >
                    <i className="fas fa-user-tie"></i> Admin/Lecturer
                  </button>
                </div>
              </div>

              {/* Extra fields for admin */}
              {userType === 'admin' && (
                <>
                  <div className="form-group">
                    <label><i className="fas fa-building"></i> Department/Institution</label>
                    <input 
                      type="text" 
                      id="signupDepartment"
                      placeholder="e.g., Computer Science Department" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-id-card"></i> Upload ID Card (Professor/Lecturer ID)</label>
                    <input 
                      type="file" 
                      id="signupIdCard"
                      accept="image/*,.pdf"
                      className="file-input"
                    />
                    <small className="file-hint">Upload your official ID card for verification</small>
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-question-circle"></i> Why do you want to be an admin?</label>
                    <textarea 
                      id="signupReason"
                      rows="3"
                      placeholder="Tell us why you need admin access..."
                      required
                    />
                  </div>
                  <div className="admin-note">
                    <i className="fas fa-info-circle"></i>
                    <small>Your ID card will be verified by super admin before approval. You'll be notified once approved.</small>
                  </div>
                </>
              )}

              <div className="terms">
                <input type="checkbox" required /> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </div>
              <button type="submit" className="btn-submit">
                {userType === 'student' ? 'Create Account' : 'Submit Admin Request'} 
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
            <p className="modal-footer">
              Already have an account? <a href="#" onClick={(e) => {
                e.preventDefault()
                setShowSignup(false)
                setShowLogin(true)
              }}>Login</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App