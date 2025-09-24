import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProtectedRoute.css';

const AdminAuth = () => {
  const { isAdminAuthenticated, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (adminLogin(adminCodeInput)) {
      navigate('/admin', { replace: true });
    } else {
      setAuthError('잘못된 관리자 코드입니다.');
      setAdminCodeInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="admin-auth-overlay">
      <div className="admin-auth-modal">
        <h2>🔐 관리자 인증</h2>
        <p>관리자 페이지에 접근하려면 인증 코드를 입력하세요.</p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={adminCodeInput}
            onChange={(e) => setAdminCodeInput(e.target.value)}
            placeholder="관리자 코드 입력"
            className="admin-code-input"
            aria-label="관리자 코드 입력"
          />
          {authError && <p className="auth-error">{authError}</p>}

          <div className="auth-buttons">
            <button type="submit" className="auth-submit-btn">확인</button>
            <button type="button" className="auth-cancel-btn" onClick={() => navigate('/', { replace: true })}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;