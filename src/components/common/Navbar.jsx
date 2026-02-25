import React from 'react'

function Navbar({ userType, userName, onLogout, onProfileClick }) {
  return (
    <nav className="dashboard-nav">
      <div className="logo">
        <i className="fas fa-compass"></i>
        <span>MyCareer<span className="logo-highlight">+</span></span>
      </div>
      <div className="nav-right">
        <div className="profile-mini" onClick={onProfileClick}>
          <img src={`https://ui-avatars.com/api/?name=${userName}&background=6366f1&color=fff`} alt={userName} />
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar