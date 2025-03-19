import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';
import Charts from './Charts'; 

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
      const uniqueCategories = [...new Set(response.data.transactions.map(t => t.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}/`);
      fetchTransactions(); 
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      
      await api.put(`/transactions/edit/${currentTransaction.id}/`, currentTransaction);
      setShowModal(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction", error.response || error);
    }
  };

  const handleFilter = () => {
    let filtered = transactions;
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    if (selectedDate) {
      filtered = filtered.filter(t => t.date.startsWith(selectedDate));
    }
    setFilteredTransactions(filtered);
  };

  const handleResetFilter = () => {
    setSelectedCategory('');
    setSelectedDate('');
    setFilteredTransactions(transactions);
  };

  return (
    <div>
      <h2>All Transactions</h2>

      {/* Filters */}
      <div className="mb-3">
        <Form.Group className="mb-2">
          <Form.Label>Filter by Category</Form.Label>
          <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleFilter} className="me-2">Filter</Button>
        <Button variant="secondary" onClick={handleResetFilter}>Reset Filters</Button>
      </div>

      {/* Transaction Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>
                <Button variant="warning" size="sm" className="me-1" onClick={() => handleEditClick(transaction)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(transaction.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTransaction && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control 
                  as="select"
                  value={currentTransaction.type}
                  onChange={(e) => setCurrentTransaction({ ...currentTransaction, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control 
                  type="number" 
                  value={currentTransaction.amount || ''} 
                  onChange={(e) => setCurrentTransaction({ ...currentTransaction, amount: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentTransaction.category || ''} 
                  onChange={(e) => setCurrentTransaction({ ...currentTransaction, category: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  type="text" 
                  value={currentTransaction.description || ''} 
                  onChange={(e) => setCurrentTransaction({ ...currentTransaction, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control 
                  type="datetime-local" 
                  value={currentTransaction.date ? currentTransaction.date.slice(0,16) : ''}
                  onChange={(e) => setCurrentTransaction({ ...currentTransaction, date: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Charts Component at the bottom */}
      <Charts />
    </div>
  );
}

export default TransactionList;
