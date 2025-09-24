import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import Books from './pages/Books';
import BookShelf from './pages/BookShelf';
import Chat from './pages/Chat';
import AdminAuth from './pages/AdminAuth';
import './App.css';

/**
 * 메인 App 컴포넌트
 * React Router를 사용하여 페이지 라우팅을 설정
 * 사용자 페이지를 기본으로 하고 관리자 페이지를 별도 경로로 설정
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<UserHome />} />

            {/* 관리자 인증 페이지(보호하지 않음) */}
            <Route path="/admin/auth" element={<AdminAuth />} />

            {/* 관리자 모든 하위 경로 보호 */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/books"
              element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/book-shelf"
              element={
                <ProtectedRoute>
                  <BookShelf />
                </ProtectedRoute>
              }
            />

            {/* Chat 페이지 */}
            <Route path="/chat" element={<Chat />} />

            {/* 기본 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
