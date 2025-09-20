import React, { useState } from 'react';
import SearchBar from './SearchBar';
import BookCard from './BookCard';
import ApiService from '../services/api';
import '../styles/SearchComponent.css'; // 검색 스타일을 위한 CSS 파일

const SearchComponent = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleClearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <section className="search-section">
      <SearchBar onSearch={handleSearch} disabled={isSearching} />
      {hasSearched && (
        <button className="clear-results-button" onClick={handleClearSearch}>
          검색 결과 지우기
        </button>
      )}
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
  );
};

export default SearchComponent;