import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

function Navbar({ currentUser, onLogout }) {
  const isAdmin = currentUser && currentUser.role === 'Admin'

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Library Logo" className="logo-image" />
        <span className="logo-text">Community Library</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/books">Books</NavLink>
        </li>
        <li>
          <NavLink to="/transactions">Transactions</NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/users">Users</NavLink>
          </li>
        )}
        {currentUser && (
          <li>
            <button
              onClick={onLogout}
              className="navbar-logout"
            >
              Logout ({currentUser.name} - {currentUser.role})
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar