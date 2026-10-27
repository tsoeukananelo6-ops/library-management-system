const API_URL = 'http://localhost:5000/api';

export const api = {
  getBooks: () => fetch(`${API_URL}/books`).then(res => res.json()),
  addBook: (data) => fetch(`${API_URL}/books`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()),
  updateBook: (id, data) => fetch(`${API_URL}/books/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()),
  deleteBook: (id) => fetch(`${API_URL}/books/${id}`, { method: 'DELETE' }).then(res => res.json()),

  getUsers: () => fetch(`${API_URL}/users`).then(res => res.json()),
  addUser: (data) => fetch(`${API_URL}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()),
  updateUser: (id, data) => fetch(`${API_URL}/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()),
  deleteUser: (id) => fetch(`${API_URL}/users/${id}`, { method: 'DELETE' }).then(res => res.json()),

  getTransactions: () => fetch(`${API_URL}/transactions`).then(res => res.json()),
  addTransaction: (data) => fetch(`${API_URL}/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(res => res.json()),
};