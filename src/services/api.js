import axios from 'axios';

// Flask 백엔드 서버 URL (.env에서 불러옴, 기본은 8000)
const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

// axios 인스턴스 생성 및 기본 설정
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

const ApiService = {
  /**
   * 모든 도서 목록을 가져오는 함수
   * @returns {Promise<Array>} 도서 객체 배열
   */
  async getBooks() {
    try {
      const response = await api.get('/api/books');
      return response.data;
    } catch (error) {
      console.error('도서 목록 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 도서 검색 함수
   * @param {string} query - 검색어 (책 제목 또는 저자)
   * @returns {Promise<Array>} 검색 결과 도서 배열
   */
  async searchBooks(query) {
    try {
      const response = await api.get(`/api/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('도서 검색 실패:', error);
      throw error;
    }
  },

  /**
   * 책 스캔 시작 함수
   * @returns {Promise<Object>} 스캔 시작 결과 객체
   */
  async startScan() {
    try {
      const response = await api.post('/api/scan');
      return response.data;
    } catch (error) {
      console.error('스캔 시작 실패:', error);
      throw error;
    }
  },

  /**
   * 책 스캔 종료 함수
   * @returns {Promise<Object>} 스캔 종료 결과 객체
   */
  async stopScan() {
    try {
      const response = await api.post('/api/scan_exit');
      return response.data;
    } catch (error) {
      console.error('스캔 종료 실패:', error);
      throw error;
    }
  },

  /**
   * 도서 상태 업데이트 함수
   * @param {Object} scanData - 스캔된 데이터 (예: {"3F-A-1-F": ["123", "234"]})
   * @returns {Promise<Object>} 업데이트 결과 (available/misplaced 등 상태 정보 포함)
   */
  async updateBookStatus(scanData) {
    try {
      const response = await api.post('/api/update_book_status', scanData);
      return response.data;
    } catch (error) {
      console.error('도서 상태 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 로봇 상태 조회 함수
   * @returns {Promise<Object>} 현재 로봇 상태 {status: "normal"|"scanning"|"complete"}
   */
  async getRobotStatus() {
    try {
      const response = await api.get('/api/robot_status');
      return response.data;
    } catch (error) {
      console.error('로봇 상태 조회 실패:', error);
      throw error;
    }
  },

  /**
   * 로봇 상태 설정 함수
   * @param {string} status - 설정할 상태 ('normal', 'scanning', 'complete')
   * @returns {Promise<Object>} 상태 변경 결과 {success: boolean, status: string}
   */
  async setRobotStatus(status) {
    try {
      const response = await api.post('/api/set_robot_status', { status });
      return response.data;
    } catch (error) {
      console.error('로봇 상태 설정 실패:', error);
      throw error;
    }
  },

  /**
   * 챗봇 대화 API
   * @param {string} message - 사용자 입력 메시지
   * @param {Array} history - 이전 대화 기록
   * @returns {Promise<{content: string, sources: Array, usage: Object}>}
   *  챗봇 응답 내용과 메타데이터
   */
  async chat(message, history = []) {
    try {
      const response = await api.post('/api/chat', {
        message,
        history,
      });
      return {
        content: response.data.answer,
        sources: response.data.sources,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('챗봇 API 호출 실패:', error);
      throw error;
    }
  },

  /**
   * 도서 위치 전송 함수
   * @param {Object} payload - 도서 위치 정보
   * @returns {Promise<Object>} 서버 응답
   */
  async postBookLocation(payload) {
    try {
      // axios 인스턴스(api)를 사용해 baseURL이 적용되도록 변경
      const response = await api.post('/api/book-click', payload);
      return response.data;
    } catch (err) {
      console.error('postBookLocation error', err);
      throw err;
    }
  },

  /**
   * 도서 안내 취소 전송 함수
   * @param {Object} payload - 취소 정보 (id, requestId 등)
   * @returns {Promise<Object>} 서버 응답
   */
  async postBookCancel(payload) {
    try {
      const response = await api.post('/api/book-cancel', payload);
      return response.data;
    } catch (err) {
      console.error('postBookCancel error', err);
      throw err;
    }
  },
};

export default ApiService;