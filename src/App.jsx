import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Transactions from './pages/Transactions'
import Users from './pages/Users'
import useLocalStorage from './hooks/useLocalStorage'
import backgroundImage from './assets/Tshoeu.png'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

const ADMIN_SEED = {
  id: 'admin-seed-0001',
  name: 'Admin',
  membershipId: '123456',
  password: 'admin123',
  role: 'Admin'
}

function App() {
  const [books, setBooks] = useLocalStorage('library_books', [])
  const [users, setUsers] = useLocalStorage('library_users', [])
  const [transactions, setTransactions] = useLocalStorage('library_transactions', [])
  const [currentUser, setCurrentUser] = useLocalStorage('library_current_user', null)

  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Library Management System'
  }, [])

  useEffect(() => {
    const adminExists = users.some((u) => u.role === 'Admin')
    if (!adminExists) {
      setUsers((prev) => {
        const filtered = prev.filter((u) => u.role !== 'Admin')
        return [...filtered, ADMIN_SEED]
      })
    }
  }, [users, setUsers])

  function handleLogin(user) {
    setCurrentUser(user)
    navigate('/')
  }

  function handleLogout() {
    setCurrentUser(null)
    navigate('/login')
  }

  function handleAddBook(bookData) {
    const newBook = { id: generateId(), ...bookData }
    setBooks((prev) => [...prev, newBook])
  }

  function handleUpdateBook(id, bookData) {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...bookData } : b)))
  }

  function handleDeleteBook(id) {
    setBooks((prev) => prev.filter((b) => b.id !== id))
    setTransactions((prev) => prev.filter((t) => t.bookId !== id))
  }

  function handleRecordTransaction({ bookId, type, quantity }) {
    const book = books.find((b) => b.id === bookId)
    if (!book) {
      return { error: 'Book not found' }
    }

    if (type === 'Deduct Stock' && quantity > book.quantity) {
      return { error: 'Cannot deduct more than available stock (' + book.quantity + ')' }
    }

    const newQuantity =
      type === 'Add Stock' ? book.quantity + quantity : book.quantity - quantity

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, quantity: newQuantity } : b))
    )

    const transaction = {
      id: generateId(),
      bookId,
      bookTitle: book.title,
      type,
      quantity,
      date: new Date().toISOString()
    }

    setTransactions((prev) => [transaction, ...prev])
    return { success: true }
  }

  function handleAddUser(userData) {
    const newUser = { id: generateId(), ...userData }
    setUsers((prev) => [...prev, newUser])
  }

  function handleUpdateUser(id, userData) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)))
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...userData }))
    }
  }

  function handleDeleteUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  if (!currentUser) {
    return (
      <div
        className="app-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Routes>
          <Route path="/login" element={<Login users={users} onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    )
  }

  return (
    <div
      className="app-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="app-overlay">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  books={books}
                  transactions={transactions}
                  users={users}
                />
              }
            />
            <Route
              path="/books"
              element={
                <Books
                  books={books}
                  onAddBook={handleAddBook}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <Transactions
                  books={books}
                  transactions={transactions}
                  onRecordTransaction={handleRecordTransaction}
                />
              }
            />
            <Route
              path="/users"
              element={
                <Users
                  users={users}
                  currentUser={currentUser}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App