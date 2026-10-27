import TransactionForm from '../components/TransactionForm'

function Transactions({ books, transactions, onRecordTransaction }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>Add or deduct stock and view transaction history</p>
      </div>

      <TransactionForm books={books} onSubmit={onRecordTransaction} />

      <div className="table-card">
        <div className="table-header">
          <h2>Transaction History</h2>
          <p>Total transactions: {transactions.length}</p>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state">No transactions recorded yet.</div>
        ) : (
          <div className="table-wrapper">
            <table id="transactionTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleString()}</td>
                    <td>{t.bookTitle}</td>
                    <td>{t.type}</td>
                    <td>{t.quantity}</td>
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

export default Transactions