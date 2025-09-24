import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // 페이지 새로고침 시 세션스토리지에서 인증 상태 복원
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (code) => {
    const correctCode = process.env.REACT_APP_ADMIN_CODE || '1234';
    if (code === correctCode) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{
      isAdminAuthenticated,
      adminLogin,
      adminLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};