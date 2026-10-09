import { useState, useEffect } from 'react'

const emptyUser = {
  name: '',
  membershipId: '',
  password: '',
  role: 'Member'
}

function UserForm({ onSubmit, editingUser, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyUser)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        membershipId: editingUser.membershipId,
        password: editingUser.password || '',
        role: editingUser.role
      })
    } else {
      setFormData(emptyUser)
    }
    setErrors({})
  }, [editingUser])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.membershipId.trim()) {
      newErrors.membershipId = 'Membership ID is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.role) newErrors.role = 'Role is required'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const userData = {
      name: formData.name.trim(),
      membershipId: formData.membershipId.trim(),
      password: formData.password,
      role: formData.role
    }

    const result = onSubmit(userData, editingUser ? editingUser.id : null)

    if (result && result.error) {
      setErrors({ membershipId: result.error })
      return
    }

    setSuccessMessage(editingUser ? 'User updated successfully' : 'User added successfully')
    setFormData(emptyUser)
    setErrors({})
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  function handleCancel() {
    setFormData(emptyUser)
    setErrors({})
    onCancelEdit()
  }

  return (
    <div className="form-card">
      <h2>{editingUser ? 'Update User' : 'Add New User'}</h2>
      <form id="userForm" onSubmit={handleSubmit} noValidate>
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
          {errors.name && <span className="form-error">{errors.name}</span>}
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
          {errors.membershipId && <span className="form-error">{errors.membershipId}</span>}
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
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="Member">Member</option>
            <option value="Librarian">Librarian</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <span className="form-error">{errors.role}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            {editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button type="button" className="cancel-button small-button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
      {successMessage && <p className="form-success">{successMessage}</p>}
    </div>
  )
}

export default UserForm