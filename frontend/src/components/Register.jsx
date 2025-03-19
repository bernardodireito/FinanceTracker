import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://127.0.0.1:8000/register/', { username, password });
          setMessage(response.data.message);
          // Optionally, navigate to login after successful registration:
          navigate('/login');
      } catch (error) {
          setMessage(error.response?.data.error || "Error registering.");
          console.error(error);
      }
  };

  return (
      <div className="container mt-4">
          <h2>Register</h2>
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
              <button type="submit" className="btn btn-primary">Register</button>
          </form>
          {message && <div className="mt-3 alert alert-info">{message}</div>}
          <p className="mt-3">
            Already have an account? <Link to="/login">Login here</Link>.
          </p>
      </div>
  );
}

export default Register;
