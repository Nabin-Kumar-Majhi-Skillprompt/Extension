import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await register(username, email, password);
      
      // Clear form and show success message
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');

      // Optional: Navigate to login or show success message
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      // Handle registration error
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          minLength="3"
        />
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength="6"
        />
        
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          minLength="6"
        />
        
        <button type="submit">Register</button>
      </form>
      
      <p>
        Already have an account? 
        <span 
          onClick={() => navigate('/login')} 
          style={{ 
            color: 'blue', 
            cursor: 'pointer', 
            marginLeft: '5px' 
          }}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;