import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // 제거
// import { useNavigate } from 'react-router-dom';    // 제거
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ScanControls from '../components/ScanControls';
import BookCard from '../components/BookCard';
import ApiService from '../services/api';
import '../styles/Home.css';

/**
 * 관리자 메인 페이지 컴포넌트
 * ProtectedRoute에서 인증을 처리하므로, 이 컴포넌트는 별도 인증 로직이 없습니다.
 */
const AdminHome = () => {
  // 검색 결과 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 도서 검색
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

  // 검색 결과 초기화
  const handleClearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="admin-home-page">
      <Header />

      <main className="admin-main-content" style={{ padding: '1.5rem' }}>
        {/* 검색 섹션 */}
        <section className="search-section">
          <SearchBar
            onSearch={handleSearch}
            disabled={isSearching}
          />

          {hasSearched && (
            <button
              className="clear-results-button"
              onClick={handleClearSearch}
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
          <ScanControls />
        </section>
      </main>
      {/* 푸터 */}
      <footer className="user-footer">
        <div className="footer-content">
          <p>&copy; 2025 한성대학교 도서관 검색 시스템</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminHome;