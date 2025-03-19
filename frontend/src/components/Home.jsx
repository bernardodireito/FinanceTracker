import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      {/* Home Section */}
      <div className="home text-center p-5" style={{ backgroundColor: '#f8f9fa' }}>
        <h1 className="display-4">Welcome to Finance Tracker</h1>
        <p className="lead">Track your expenses and incomes with ease. Get insights and make smarter financial decisions.</p>
        <Link to="/add" className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </div>
      
      {/* Features Section */}
      <div className="features mt-5">
        <div className="row text-center">
          <div className="col-md-4">
            <h3>Easy Transactions</h3>
            <p>Add income and expense entries in just a few clicks.</p>
          </div>
          <div className="col-md-4">
            <h3>Interactive Dashboard</h3>
            <p>Visualize your financial data with dynamic charts and summaries.</p>
          </div>
          <div className="col-md-4">
            <h3>Secure & Reliable</h3>
            <p>Your financial data is stored safely and securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
