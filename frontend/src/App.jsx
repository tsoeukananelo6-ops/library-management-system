import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Transactions from './pages/Transactions'
import Users from './pages/Users'
import { api } from './api'
import backgroundImage from './assets/Tshoeu.png'

function App() {
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  // Fetch data from the Backend API on mount using safe try/catch/finally
  useEffect(() => {
    document.title = 'Library Management System'
    
    async function loadData() {
      try {
        const booksData = await api.getBooks()
        const usersData = await api.getUsers()
        const txData = await api.getTransactions()
        
        setBooks(booksData)
        setUsers(usersData)
        setTransactions(txData)
      } catch (err) {
        console.error("Failed to fetch data from backend:", err)
        alert("Could not connect to the backend server. Please make sure it is running and CORS is enabled.")
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  function handleLogin(user) {
    setCurrentUser(user)
    navigate('/')
  }

  function handleLogout() {
    setCurrentUser(null)
    navigate('/login')
  }

  // --- BOOK FUNCTIONS ---
  async function handleAddBook(bookData) {
    const newBook = await api.addBook(bookData)
    setBooks((prev) => [...prev, newBook])
  }

  async function handleUpdateBook(id, bookData) {
    const updated = await api.updateBook(id, bookData)
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  async function handleDeleteBook(id) {
    await api.deleteBook(id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
    // The backend uses ON DELETE CASCADE, so we update the UI immediately
    setTransactions((prev) => prev.filter((t) => t.bookId !== id))
  }

  // --- TRANSACTION FUNCTIONS ---
  async function handleRecordTransaction({ bookId, type, quantity }) {
    const book = books.find((b) => b.id === bookId)
    if (!book) {
      return { error: 'Book not found' }
    }

    if (type === 'Deduct Stock' && quantity > book.quantity) {
      return { error: 'Cannot deduct more than available stock (' + book.quantity + ')' }
    }

    // Send transaction to backend
    const newTx = await api.addTransaction({
      bookId,
      bookTitle: book.title,
      type,
      quantity
    })

    // Update local state to match backend
    setTransactions((prev) => [newTx, ...prev])
    
    const newQuantity =
      type === 'Add Stock' ? book.quantity + quantity : book.quantity - quantity
      
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, quantity: newQuantity } : b))
    )
    
    return { success: true }
  }

  // --- USER FUNCTIONS ---
  async function handleAddUser(userData) {
    const newUser = await api.addUser(userData)
    setUsers((prev) => [...prev, newUser])
  }

  async function handleUpdateUser(id, userData) {
    const updated = await api.updateUser(id, userData)
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...userData }))
    }
  }

  async function handleDeleteUser(id) {
    await api.deleteUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  if (loading) {
    return (
      <div className="app-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <h2 style={{ color: '#b56780', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
            Connecting to Database...
          </h2>
        </div>
      </div>
    )
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