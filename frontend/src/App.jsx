// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './components/Home';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import FinancialSummary from './components/FinancialSummary';
import MonthlySummary from './components/MonthlySummary';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            {/* Clicking the title routes to the Home page */}
            <Navbar.Brand as={NavLink} to="/">Finance Tracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/transactions">Transactions</Nav.Link>
                <Nav.Link as={NavLink} to="/add">Add Transaction</Nav.Link>
                <Nav.Link as={NavLink} to="/summary">Overall Summary</Nav.Link>
                <Nav.Link as={NavLink} to="/monthly">Monthly Summary</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/summary" element={<FinancialSummary />} />
            <Route path="/monthly" element={<MonthlySummary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
      </>
    </Router>
  );
}

export default App;
