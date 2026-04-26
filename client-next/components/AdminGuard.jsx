"use client";

import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import API_URL from '@/lib/api';

const AdminGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem('adminPasskey');
    if (savedKey) {
      verifyPasskey(savedKey, true);
    }
    
  }, []);

  const verifyPasskey = async (keyToTest, isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError('');
      
      const response = await axios.post(
        `${API_URL}/api/admin/verify`, 
        {}, // Empty body
        { headers: { 'x-admin-passkey': keyToTest } }
      );

      if (response.data.success) {
        sessionStorage.setItem('adminPasskey', keyToTest);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Clear invalid key
      sessionStorage.removeItem('adminPasskey');
      setIsAuthenticated(false);
      
      if (!isSilent) {
        if (err.response?.status === 429) {
          setError('Too many authentication attempts. Please try again later after 30 minutes.');
        } else if (err.response?.status === 401) {
          setError('Authentication failed. Please verify your credentials.');
        } else {
          setError('Unable to verify credentials at the moment. Please try again later.');
        }
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passkey.trim()) return;
    verifyPasskey(passkey);
  };

  if (isAuthenticated) {
    return children;
  }

  // Passkey Prompt UI
  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="auth-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center', borderRadius: '12px', background: '#322f2f' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: '#451a21', padding: '1rem', borderRadius: '50%' }}>
            <Lock size={40} color="#ff3e55" />
          </div>
        </div>
        
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Admin Access Restricted</h2>
        <p style={{ color: '#a0a0a0', marginBottom: '2rem', fontSize: '0.9rem' }}>
          This area is strictly for authorized personnel. Enter your passkey to continue. Note: Multiple failed attempt in short time block.
        </p>

        {error && (
          <div style={{ background: '#451a21', color: '#ff3e55', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textAlign: 'left' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', color: '#a0a0a0', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Security Passkey</label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter passkey"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #4a4a4a', background: '#242424', color: 'white', outline: 'none' }}
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !passkey.trim()}
            style={{ width: '100%', padding: '0.875rem', borderRadius: '6px', background: '#10b981', color: 'white', border: 'none', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Verifying...' : (
              <>
                <ShieldCheck size={18} />
                Unlock Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminGuard;
