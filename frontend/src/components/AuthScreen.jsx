import React, { useState } from 'react';
import { api } from '../services/api';
import { BookOpen } from 'lucide-react';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await api.login(email, password);
        onAuthSuccess(data.user);
      } else {
        const data = await api.register(email, password);
        onAuthSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="sidebar-logo" style={{ justifyContent: 'center', fontSize: '24px', paddingLeft: 0 }}>
            <BookOpen className="sidebar-logo-icon" size={28} />
            <span>VocabVault</span>
          </div>
          <span className="auth-subtitle">
            {isLogin
              ? 'Enter your credentials to access your vault'
              : 'Create a private vault to build your lifelong vocabulary'}
          </span>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              color: '#EF4444',
              fontSize: '13px',
              lineHeight: '1.4',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              className="form-input"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-input"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Vault'}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            {isLogin ? "Don't have an account? " : 'Already have a vault? '}
            <button
              type="button"
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              disabled={loading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
