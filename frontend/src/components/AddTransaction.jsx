import React, { useState } from 'react';
import axios from 'axios';

function AddTransaction() {
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    date: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Append seconds if missing (for ISO-8601 compliance)
    let formattedDate = formData.date;
    if (formattedDate && formattedDate.length === 16) { // "YYYY-MM-DDTHH:MM" length
      formattedDate += ":00";
    }
    const payload = {
      ...formData,
      date: formattedDate,
    };

    // Retrieve your access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Decide endpoint based on transaction type
    const endpoint = formData.type === 'income'
      ? 'http://127.0.0.1:8000/transactions/income/'
      : 'http://127.0.0.1:8000/transactions/expense/';

    try {
      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      setMessage('Transaction added successfully!');
      setFormData({
        type: 'income',
        amount: '',
        category: '',
        date: '',
        description: ''
      });
    } catch (error) {
      console.error("Add Transaction Error:", error.response || error);
      setMessage('Error adding transaction.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Transaction</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-control"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="datetime-local"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Transaction</button>
      </form>
    </div>
  );
}

export default AddTransaction;
