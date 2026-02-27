import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import API_URL from '../../config/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showGoogleUsernameSetup, setShowGoogleUsernameSetup] = useState(false);
  const [googleTempData, setGoogleTempData] = useState(null);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleUsername, setGoogleUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        try {
          await login(data.user, data.token);
          
          // Redirect based on role or to home
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (loginError) {
          console.error('Login state update failed:', loginError);
          setError('Login successful but failed to save session. Please try clearing your browser cache.');
        }
      } else {
        console.error('Login failed with status:', response.status, data);
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleClearSession = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await response.json();

      if (data.pending) {
        // New user needs to choose username
        setGoogleTempData(data.tempData);
        setGoogleCredential(credentialResponse.credential);
        setShowGoogleUsernameSetup(true);
      } else if (response.ok) {
        // Existing user or completed signup
        login(data.user, data.token);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Google Login failed');
      }
    } catch (err) {
      console.error('Google Login Error Details:', err);
      // Display full error details for debugging
      const errorDetails = err.response?.data?.message || err.message || JSON.stringify(err);
      setError(`Google Login Failed: ${errorDetails}`);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed (Component Level)');
    setError('Google Login Popup Closed or Failed. If you saw a 400 error, you need to update Google Console.');
  };

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/test`);
      const data = await res.json();
      alert(`Backend Status: ${data.status}`);
    } catch (err) {
      alert(`Backend Connection Failed: ${err.message}`);
    }
  };

  const handleGoogleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUsernameError('');

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(googleUsername)) {
      setUsernameError('Username must be 3-30 characters and contain only letters, numbers, and underscores');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token: googleCredential,
          username: googleUsername 
        })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message || 'Failed to complete signup');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        className="listing-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>
          {showGoogleUsernameSetup ? 'Choose Username' : 'Welcome Back'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {showGoogleUsernameSetup ? 'Complete your Google signup by choosing a username' : 'Login to access your account'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '0.5rem', wordBreak: 'break-word' }}>{error}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {error.includes('client only') || error.includes('save session') ? (
                <button 
                  onClick={handleClearSession}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Clear Session
                </button>
              ) : null}
              <button 
                onClick={checkBackendHealth}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Test Backend
              </button>
            </div>
          </div>
        )}

        {showGoogleUsernameSetup ? (
          // Google Username Setup Form
          <form onSubmit={handleGoogleUsernameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Hi {googleTempData?.name}! Please choose a unique username to continue.
              </p>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Username</label>
              <input 
                type="text" 
                value={googleUsername} 
                onChange={(e) => setGoogleUsername(e.target.value)}
                required 
                placeholder="your_username"
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  borderRadius: '8px', 
                  border: usernameError ? '1px solid #ef4444' : '1px solid var(--border)', 
                  background: 'var(--background)', 
                  color: 'var(--text-main)' 
                }}
              />
              {usernameError && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{usernameError}</p>
              )}
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                3-30 characters, letters, numbers, and underscores only
              </p>
            </div>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Complete Signup <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          // Regular Login Form
          <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="300"
                theme="filled_blue"
                shape="pill"
              />
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '1.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                <span style={{ padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              </div>
            </div>
          </>
        )}

        {!showGoogleUsernameSetup && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                required 
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                required 
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            Login <ArrowRight size={18} />
          </button>
        </form>
        )}

        {!showGoogleUsernameSetup && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
