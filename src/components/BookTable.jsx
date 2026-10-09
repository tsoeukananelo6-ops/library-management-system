function BookTable({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">No books available. Add a book to get started.</div>
      </div>
    )
  }

  return (
    <div className="table-card">
      <div className="table-header">
        <h2>Book List</h2>
        <p>Total books: {books.length}</p>
      </div>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              let statusText = 'Available'
              let statusClass = ''
              if (book.quantity === 0) {
                statusText = 'Out of Stock'
                statusClass = 'out-of-stock'
              } else if (book.quantity < 2) {
                statusText = 'Low Stock'
                statusClass = 'low-stock'
              }

              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <span className={statusClass} style={{ padding: '5px 10px', borderRadius: '4px' }}>
                      {statusText}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="small-button edit-button" onClick={() => onEdit(book)}>
                        Edit
                      </button>
                      <button className="small-button delete-button" onClick={() => onDelete(book.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookTable