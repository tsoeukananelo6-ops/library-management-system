import { useState } from 'react'
import UserForm from '../components/UserForm'

function Users({ users, currentUser, onAddUser, onUpdateUser, onDeleteUser }) {
  const [editingUser, setEditingUser] = useState(null)

  const isAdmin = currentUser && currentUser.role === 'Admin'

  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>User Management</h1>
          <p>Access restricted</p>
        </div>
        <div className="table-card">
          <div className="empty-state">
            Only administrators can access user management.
          </div>
        </div>
      </div>
    )
  }

  function handleSubmit(userData, id) {
    if (id) {
      const duplicate = users.find(
        (u) =>
          u.membershipId.toLowerCase() === userData.membershipId.toLowerCase() &&
          u.id !== id
      )
      if (duplicate) {
        return { error: 'Another user already uses this membership ID' }
      }
      onUpdateUser(id, userData)
    } else {
      const duplicate = users.find(
        (u) => u.membershipId.toLowerCase() === userData.membershipId.toLowerCase()
      )
      if (duplicate) {
        return { error: 'A user with this membership ID already exists' }
      }
      onAddUser(userData)
    }
    setEditingUser(null)
    return { success: true }
  }

  function handleDelete(id) {
    if (currentUser && currentUser.id === id) {
      window.alert('You cannot delete the currently logged in user.')
      return
    }
    const target = users.find((u) => u.id === id)
    if (target && target.role === 'Admin') {
      window.alert('The seed admin account cannot be deleted.')
      return
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(id)
      if (editingUser && editingUser.id === id) {
        setEditingUser(null)
      }
    }
  }

  function getRoleClass(role) {
    if (role === 'Admin') return 'badge badge-admin'
    if (role === 'Librarian') return 'badge badge-librarian'
    return 'badge badge-member'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage library members, librarians, and administrators</p>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        editingUser={editingUser}
        onCancelEdit={() => setEditingUser(null)}
      />

      <div className="table-card">
        <div className="table-header">
          <h2>Registered Users</h2>
          <p>Total users: {users.length}</p>
        </div>
        {users.length === 0 ? (
          <div className="empty-state">No users registered yet.</div>
        ) : (
          <div className="table-wrapper">
            <table id="userTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Membership ID</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.membershipId}</td>
                    <td>
                      <span className={getRoleClass(user.role)}>{user.role}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="small-button edit-button"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="small-button delete-button"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users