function Dashboard({ books, transactions, users }) {
  const totalBooks = books.length
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0)
  const lowStockBooks = books.filter((b) => b.quantity < 2)
  const totalUsers = users.length
  const totalTransactions = transactions.length

  return (
    <div className="dashboard">
      <div className="welcome">
        <h1>Library Dashboard</h1>
        <p>Overview of your community library system</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Books</h3>
          <p>{totalBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Total Copies</h3>
          <p>{totalCopies}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock</h3>
          <p>{lowStockBooks.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
      </div>

      <div className="stats-container" style={{ marginTop: '0' }}>
        <div className="stat-card">
          <h3>Transactions</h3>
          <p>{totalTransactions}</p>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: '30px' }}>
        <div className="table-header">
          <h2>Book Availability</h2>
          <p>Books with fewer than 2 copies are highlighted</p>
        </div>
        {books.length === 0 ? (
          <div className="empty-state">No books in the library yet.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  let rowClass = ''
                  let statusText = 'Available'
                  if (book.quantity === 0) {
                    rowClass = 'out-of-stock'
                    statusText = 'Out of Stock'
                  } else if (book.quantity < 2) {
                    rowClass = 'low-stock'
                    statusText = 'Low Stock'
                  }
                  return (
                    <tr key={book.id} className={rowClass}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>{book.quantity}</td>
                      <td>{statusText}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard