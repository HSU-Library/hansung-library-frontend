import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, adminLogin } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(!isAdminAuthenticated);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (showPasswordPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordPrompt]);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (adminLogin(adminCodeInput)) {
      setShowPasswordPrompt(false);
      setAdminCodeInput('');
    } else {
      setAuthError('잘못된 관리자 코드입니다.');
      setAdminCodeInput('');
      inputRef.current?.focus();
    }
  };

  if (showPasswordPrompt) {
    return (
      <div className="admin-auth-overlay">
        <div className="admin-auth-modal">
          <h2>🔐 관리자 인증</h2>
          <p>관리자 페이지에 접근하려면 인증 코드를 입력하세요.</p>
          
          <form onSubmit={handleAdminSubmit}>
            <input
              ref={inputRef}
              type="password"
              value={adminCodeInput}
              onChange={(e) => setAdminCodeInput(e.target.value)}
              placeholder="관리자 코드 입력"
              className="admin-code-input"
            />
            
            {authError && <p className="auth-error">{authError}</p>}
            
            <div className="auth-buttons">
              <button type="submit" className="auth-submit-btn">
                확인
              </button>
              <button 
                type="button" 
                className="auth-cancel-btn"
                onClick={() => window.history.back()}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/auth" replace state={{ from: location }} />;
  }
  
  return children;
};

export default ProtectedRoute;