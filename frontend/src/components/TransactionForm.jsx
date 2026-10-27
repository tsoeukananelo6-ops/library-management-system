import { useState } from 'react'

function TransactionForm({ books, onSubmit }) {
  const [formData, setFormData] = useState({
    bookId: '',
    type: 'Add Stock',
    quantity: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.bookId) newErrors.bookId = 'Please select a book'
    const qty = Number(formData.quantity)
    if (formData.quantity === '' || isNaN(qty)) {
      newErrors.quantity = 'Quantity is required'
    } else if (qty <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero'
    } else if (!Number.isInteger(qty)) {
      newErrors.quantity = 'Quantity must be a whole number'
    }

    if (formData.type === 'Deduct Stock' && formData.bookId) {
      const book = books.find((b) => b.id === formData.bookId)
      if (book && qty > book.quantity) {
        newErrors.quantity = 'Cannot deduct more than available stock (' + book.quantity + ')'
      }
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

    const result = onSubmit({
      bookId: formData.bookId,
      type: formData.type,
      quantity: Number(formData.quantity)
    })

    if (result && result.error) {
      setErrors({ quantity: result.error })
      return
    }

    setSuccessMessage('Transaction recorded successfully')
    setFormData({ bookId: '', type: 'Add Stock', quantity: '' })
    setErrors({})
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <div className="form-card">
      <h2>Record Transaction</h2>
      <form id="transactionForm" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="bookId">Book</label>
          <select id="bookId" name="bookId" value={formData.bookId} onChange={handleChange}>
            <option value="">-- Select a book --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} (Stock: {book.quantity})
              </option>
            ))}
          </select>
          {errors.bookId && <span className="form-error">{errors.bookId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Transaction Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="Add Stock">Add Stock</option>
            <option value="Deduct Stock">Deduct Stock (Borrow)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
          />
          {errors.quantity && <span className="form-error">{errors.quantity}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            Record Transaction
          </button>
        </div>
      </form>
      {successMessage && <p className="form-success">{successMessage}</p>}
    </div>
  )
}

export default TransactionForm