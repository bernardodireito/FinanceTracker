import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Logging in with:", username.trim(), password);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/login/',
        { username: username.trim(), password: password },

      );
      
      console.log("Login response:", response.data);
      
     
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setMessage('Logged in successfully!');
     
      navigate('/');
    } catch (error) {
   
      console.error("Login error:", error.response?.data);
      setMessage(error.response?.data.error || "Error logging in.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}

export default Login;
