import React, { useState } from 'react';
import api from '../services/api'; 

function MonthlySummary() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/summary/monthly/${year}/${month}/`); 
      setSummary(response.data);
      setError('');
    } catch (err) {
      console.error("Error fetching monthly summary", err);
      setError("Failed to load monthly summary. Check the console for more details.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSummary();
  };

  return (
    <div>
      <h2>Monthly Summary</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-3">
          <label>Year:</label>
          <input 
            type="number" 
            className="form-control" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mb-3">
          <label>Month (1-12):</label>
          <input 
            type="number" 
            className="form-control" 
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
            min="1" 
            max="12" 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Get Monthly Summary</button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {summary && (
        <div className="card p-3">
          <p><strong>Total Income:</strong> {summary.total_income}</p>
          <p><strong>Total Expenses:</strong> {summary.total_expenses}</p>
          <p><strong>Balance:</strong> {summary.balance}</p>
        </div>
      )}
    </div>
  );
}

export default MonthlySummary;
