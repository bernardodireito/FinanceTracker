import React, { useState, useEffect } from 'react';
import api from '../services/api'; 

function FinancialSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/balance/'); 
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary", error);
    }
  };

  return (
    <div>
      <h2>Overall Financial Summary</h2>
      {summary ? (
        <div className="card p-3">
          <p><strong>Total Income:</strong> {summary.total_income}</p>
          <p><strong>Total Expenses:</strong> {summary.total_expenses}</p>
          <p><strong>Balance:</strong> {summary.balance}</p>
        </div>
      ) : (
        <p>Loading summary...</p>
      )}
    </div>
  );
}

export default FinancialSummary;
