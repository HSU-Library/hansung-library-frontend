import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ScanControls from '../components/ScanControls';
import BookCard from '../components/BookCard';
import ApiService from '../services/api';
import '../styles/Home.css';

/**
 * 관리자 메인 페이지 컴포넌트
 * 도서관 관리 시스템의 관리자 화면
 * 검색 기능, 스캔 제어, 검색 결과 표시를 포함
 */
const AdminHome = () => {
  // 검색 결과 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  // 검색 중 로딩 상태 관리
  const [isSearching, setIsSearching] = useState(false);
  // 검색 실행 여부 상태 관리
  const [hasSearched, setHasSearched] = useState(false);

  // 관리자 인증 관련 상태
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 화면 스케일링(1920x1200 기준) — iPad 1920*1200 환경에 맞춰 반응형 처리
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const computeScale = () => {
      const scaleW = window.innerWidth / 1920;
      const scaleH = window.innerHeight / 1200;
      const s = Math.min(scaleW, scaleH, 1);
      setScale(s);
    };
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  useEffect(() => {
    if (showPasswordPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordPrompt]);

  /**
   * 도서 검색 실행 함수
   * @param {string} query - 검색어
   */
  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      setHasSearched(true);

      const results = await ApiService.searchBooks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * 검색 결과 초기화 함수
   */
  const handleClearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
  };

  // 관리자 코드 검증 (환경변수 REACT_APP_ADMIN_CODE 사용, 없으면 기본 '1234')
  const verifyAdminCode = (code) => {
    const expected = process.env.REACT_APP_ADMIN_CODE || '1234';
    return code.trim() === expected;
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (verifyAdminCode(adminCodeInput)) {
      setIsAuthorized(true);
      setShowPasswordPrompt(false);
      setAuthError('');
      setAdminCodeInput('');
    } else {
      setAuthError('암호 코드가 올바르지 않습니다.');
      setIsAuthorized(false);
      setShowPasswordPrompt(true);
      setAdminCodeInput('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleAdminCancel = () => {
    // 인증 취소 시 사용자 페이지로 이동
    setAdminCodeInput('');
    setAuthError('');
    setShowPasswordPrompt(true);
    setIsAuthorized(false);
    // '/' 경로를 사용자 홈으로 가정하여 이동 처리
    navigate('/');
  };

  return (
    <div
      className="home-page"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '1920px',
        margin: '0 auto',
      }}
    >
      {/* 헤더 컴포넌트 */}
      <Header />

      {/* 관리자 비밀번호 프롬프트(페이지 진입 시 반드시 입력) */}
      {showPasswordPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleAdminSubmit}
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              width: 420,
              maxWidth: '90%',
              boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 8 }}>관리자 인증</h2>
            <p style={{ marginTop: 0, marginBottom: 16 }}>
              관리자 화면에 접근하려면 암호 코드를 입력하세요.
            </p>
            <input
              ref={inputRef}
              type="password"
              value={adminCodeInput}
              onChange={(e) => setAdminCodeInput(e.target.value)}
              placeholder="암호 코드 입력"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 16,
                marginBottom: 8,
                boxSizing: 'border-box',
              }}
            />
            {authError && (
              <div style={{ color: 'crimson', marginBottom: 8 }}>{authError}</div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleAdminCancel}
                style={{
                  padding: '8px 12px',
                  background: '#eee',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 12px',
                  background: '#0066cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                인증
              </button>
            </div>
          </form>
        </div>
      )}

      <main className="main-content" style={{ padding: 24 }}>
        {/* 도서관 이미지 컨테이너 (반응형 스케일로 처리되어 있어 주석 유지) */}
        {/* <div className="image-container">
          <img 
            src="/images/image2.png" 
            alt="도서관 이미지 2" 
            className="library-image"
            onError={(e) => {
              e.target.src = '/default-library.jpg';
            }}
          />
          <img 
            src="/images/image1.png" 
            alt="도서관 이미지 1" 
            className="library-image"
            onError={(e) => {
              e.target.src = '/default-library.jpg';
            }}
          />
          <img 
            src="/images/image3.png" 
            alt="도서관 이미지 3" 
            className="library-image"
            onError={(e) => {
              e.target.src = '/default-library.jpg';
            }}
          />
        </div> */}

        {/* 검색 섹션 */}
        <section className="search-section">
          <SearchBar
            onSearch={handleSearch}
            disabled={isSearching || !isAuthorized}
          />

          {/* 검색 결과 초기화 버튼 */}
          {hasSearched && (
            <button
              className="clear-results-button"
              onClick={handleClearSearch}
              disabled={!isAuthorized}
            >
              검색 결과 지우기
            </button>
          )}
        </section>

        {/* 검색 결과 표시 섹션 */}
        <section className="search-results-section">
          {isSearching && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>검색 중...</p>
            </div>
          )}

          {!isSearching && hasSearched && (
            <div className="results-container">
              {searchResults.length > 0 ? (
                <>
                  <h3 className="results-title">
                    검색 결과 ({searchResults.length}건)
                  </h3>
                  <div className="book-cards-grid">
                    {searchResults.map((book, index) => (
                      <BookCard key={`${book.barcode}-${index}`} book={book} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <p>책을 찾을 수 없습니다.</p>
                  <p>다른 검색어를 시도해보세요.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 스캔 제어 섹션 */}
        <section className="scan-section">
          <ScanControls disabled={!isAuthorized} />
        </section>
      </main>
    </div>
  );
};

export default AdminHome;