import { useState } from 'react'
import BookForm from '../components/BookForm'
import BookTable from '../components/BookTable'

function Books({ books, onAddBook, onUpdateBook, onDeleteBook }) {
  const [editingBook, setEditingBook] = useState(null)

  function handleSubmit(bookData, id) {
    if (id) {
      const duplicate = books.find(
        (b) => b.isbn === bookData.isbn && b.id !== id
      )
      if (duplicate) {
        return { error: 'Another book already uses this ISBN' }
      }
      onUpdateBook(id, bookData)
    } else {
      const duplicate = books.find((b) => b.isbn === bookData.isbn)
      if (duplicate) {
        return { error: 'A book with this ISBN already exists' }
      }
      onAddBook(bookData)
    }
    setEditingBook(null)
    return { success: true }
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDeleteBook(id)
      if (editingBook && editingBook.id === id) {
        setEditingBook(null)
      }
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Book Management</h1>
        <p>Add, update, and remove books from the library collection</p>
      </div>

      <BookForm
        onSubmit={handleSubmit}
        editingBook={editingBook}
        onCancelEdit={() => setEditingBook(null)}
      />

      <BookTable books={books} onEdit={setEditingBook} onDelete={handleDelete} />
    </div>
  )
}

export default Books