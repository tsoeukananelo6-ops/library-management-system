import { useState, useEffect } from 'react'

const emptyBook = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: ''
}

function BookForm({ onSubmit, editingBook, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyBook)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        isbn: editingBook.isbn,
        quantity: String(editingBook.quantity)
      })
    } else {
      setFormData(emptyBook)
    }
    setErrors({})
  }, [editingBook])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required'
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required'
    } else if (!/^\d{10}$|^\d{13}$/.test(formData.isbn.trim())) {
      newErrors.isbn = 'ISBN must be 10 or 13 digits'
    }
    const qty = Number(formData.quantity)
    if (formData.quantity === '' || isNaN(qty)) {
      newErrors.quantity = 'Quantity is required'
    } else if (qty < 0) {
      newErrors.quantity = 'Quantity cannot be negative'
    } else if (!Number.isInteger(qty)) {
      newErrors.quantity = 'Quantity must be a whole number'
    }
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      isbn: formData.isbn.trim(),
      quantity: Number(formData.quantity)
    }

    const result = onSubmit(bookData, editingBook ? editingBook.id : null)

    if (result && result.error) {
      setErrors({ isbn: result.error })
      return
    }

    setSuccessMessage(editingBook ? 'Book updated successfully' : 'Book added successfully')
    setFormData(emptyBook)
    setErrors({})
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  function handleCancel() {
    setFormData(emptyBook)
    setErrors({})
    onCancelEdit()
  }

  return (
    <div className="form-card">
      <h2>{editingBook ? 'Update Book' : 'Add New Book'}</h2>
      <form id="bookForm" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
          {errors.author && <span className="form-error">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            id="genre"
            name="genre"
            type="text"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Enter genre"
          />
          {errors.genre && <span className="form-error">{errors.genre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter 10 or 13 digit ISBN"
          />
          {errors.isbn && <span className="form-error">{errors.isbn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
          />
          {errors.quantity && <span className="form-error">{errors.quantity}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
          {editingBook && (
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

export default BookForm