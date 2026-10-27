import { useState } from 'react'
import logo from '../assets/logo.png'

function Login({ users, onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    membershipId: '',
    password: '',
    role: 'Member'
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = formData.name.trim()
    const membershipId = formData.membershipId.trim()
    const password = formData.password
    const role = formData.role

    if (!name || !membershipId || !password || !role) {
      setError('Please fill in all fields')
      return
    }

    const user = users.find(
      (u) =>
        u.name.toLowerCase() === name.toLowerCase() &&
        u.membershipId.toLowerCase() === membershipId.toLowerCase() &&
        u.password === password &&
        u.role === role
    )

    if (!user) {
      setError('Invalid credentials. Please check your details and role.')
      return
    }

    onLogin(user)
  }

  return (
    <div className="auth-scroll">
      <div className="login-box">
        <img src={logo} alt="Library Logo" className="login-logo-image" />
        <h1>Library Login</h1>
        <p>Enter your details to continue</p>

        <form id="userLoginForm" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="membershipId">Membership ID</label>
            <input
              id="membershipId"
              name="membershipId"
              type="text"
              value={formData.membershipId}
              onChange={handleChange}
              placeholder="Enter membership ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login