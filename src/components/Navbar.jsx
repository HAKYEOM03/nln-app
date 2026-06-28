import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          NLN
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/hackathon" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Hackathon
          </NavLink>
          <NavLink to="/president" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            총장배
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
