import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import ApiService from '../services/api';
import '../styles/UserHome.css';
import ChatButton from '../components/ChatButton';
/**
 * 사용자 메인 페이지 컴포넌트
 * 간단한 도서 검색 기능과 관리자 페이지로의 링크를 제공
 */
const UserHome = () => {
  const navigate = useNavigate();
  // 검색 결과 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  // 검색 중 로딩 상태 관리
  const [isSearching, setIsSearching] = useState(false);
  // 검색 실행 여부 상태 관리
  const [hasSearched, setHasSearched] = useState(false);

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

  /**
   * 관리자 페이지로 이동하는 함수
   */
  const handleGoToAdmin = () => {
    navigate('/admin');
  };
  /*임시 목 데이터*/
const mockPopularBooks = [
  {
    id: 1,
    title: "데미안",
    author: "헤르만 헤세",
    coverImageUrl: "/images/demian.jpg",
    description: "자아를 찾기 위한 청춘의 여정"
  },
  {
    id: 2,
    title: "미드나잇 라이브러리",
    author: "매트 헤이그",
    coverImageUrl: "/images/midnight.jpg",
    description: "삶과 죽음 사이에서 펼쳐지는 무한한 가능성"
  },
  {
    id: 3,
    title: "총, 균, 쇠",
    author: "재레드 다이아몬드",
    coverImageUrl: "/images/guns.jpg",
    description: "인류 문명의 결정적 순간을 파헤친다"
  },
  {
    id: 3,
    title: "죽고 싶지만 떡볶이는 먹고 싶어",
    author: "백세희",
    coverImageUrl: "/images/tteokbokki.jpg",
    description: "일상의 우울을 솔직하게 풀어낸 감성 에세이"
  },
  {
    id: 4,
    title: "트렌드 코리아 2025",
    author: "김난도 외",
    coverImageUrl: "/images/trend2025.jpg",
    description: "다가올 시대를 준비하는 교양 필독서"
  },
  {
    id: 5,
    title: "아몬드",
    author: "손원평",
    coverImageUrl: "/images/almond.jpg",
    description: "감정을 느끼지 못하는 소년의 성장 이야기"
  },
  {
    id: 6,
    title: "지적 대화를 위한 넓고 얕은 지식 1",
    author: "채사장",
    coverImageUrl: "/images/knowledge.jpg",
    description: "철학, 정치, 경제를 아우르는 전천후 교양서"
  },
  {
    id: 7,
    title: "월든",
    author: "헨리 데이비드 소로",
    coverImageUrl: "/images/walden.jpg",
    description: "자연 속 고요한 삶과 성찰의 명작"
  },
  {
    id: 8,
    title: "어린 왕자",
    author: "생텍쥐페리",
    coverImageUrl: "/images/prince.jpg",
    description: "순수함과 인생의 본질을 일깨우는 이야기"
  },
  {
    id: 9,
    title: "공정하다는 착각",
    author: "마이클 샌델",
    coverImageUrl: "/images/fairness.jpg",
    description: "능력주의의 그늘을 파헤친 도발적 철학 에세이"
  },
  {
    id: 10,
    title: "팩트풀니스",
    author: "한스 로슬링",
    coverImageUrl: "/images/factfulness.png",
    description: "세상을 바로 보는 긍정적 사고의 안내서"
  }
];
const scrollSlider = (direction) => {
  const slider = document.getElementById('popular-slider');
  const scrollAmount = 200;
  slider.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
};
  return (
    <div className="user-home-page">
      {/* 관리자 페이지 링크 */}
      <div className="admin-link-container">
        <button 
          className="admin-link-button"
          onClick={handleGoToAdmin}
          title="관리자 페이지로 이동"
        >
          🔧 관리자 페이지
        </button>
      </div>

      {/* 메인 헤더 */}
      <header className="user-header">
        <div className="header-content">
          <h1 className="main-title">📚 한성대 학술정보관 검색 시스템</h1>
        </div>
      </header>

      <main className="user-main-content">

        {/* 검색 섹션 */}
        <section className="search-section">
            <SearchBar 
              onSearch={handleSearch}
              disabled={isSearching}
              placeholder="책 제목 또는 저자를 입력하세요"
            />
            
            {/* 검색 결과 초기화 버튼 */}
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
                  <p>검색 결과가 없습니다.</p>
                  <p>다른 검색어를 시도해보세요.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="popular-books">
          <div className="popular-books-section">
            <h3>📘 한성대 인기도서 TOP 10</h3>
            <div className="slider-wrapper">
              <button className="scroll-button left" onClick={() => scrollSlider('left')}>◀</button>

              <div className="popular-books-slider" id="popular-slider">
                {mockPopularBooks.map((book, index) => (
                  <div className="book-rank-item" key={book.id}>
                    <div className="rank-number">#{index + 1}</div>
                    <div className="book-image-wrapper">
                      <img src={book.coverImageUrl} alt={book.title} className="book-cover" />
                      <div className="book-hover-description">
                        <p><strong>{book.title}</strong><br />{book.author}</p>
                        <p className="desc">{book.description}</p>
                      </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                  </div>
                ))}
              </div>

              <button className="scroll-button right" onClick={() => scrollSlider('right')}>▶</button>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="user-footer">
        <div className="footer-content">
          <p>&copy; 2025 한성대학교 도서관 검색 시스템</p>
        </div>
      </footer>
      <ChatButton />
    </div>
  );
};

export default UserHome;