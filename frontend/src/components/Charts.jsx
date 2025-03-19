import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

function Charts() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const COLORS = ['#F5A623', '#C49A6C', '#A0522D','#BC8F8F', '#DEB887'];

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

    const incomeData = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const incomeExpenseData = [
    { name: 'Income', value: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Expenses', value: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) },
  ];

  return (
    <div>
      <h2>Data Visualization</h2>
      <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie 
            data={[...expenseData, ...incomeData]} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={100}
        >
            {[...expenseData, ...incomeData].map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={incomeExpenseData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#D2B48C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;
