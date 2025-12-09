/**
 * 시간 관리 유틸리티
 * 현실 시간과 동기화된 시간 계산 로직
 */
export class TimeManager {
    constructor() {
        this.startTime = Date.now();
        this.lastSavedTime = null;
    }

    /**
     * 현재 경과 시간 가져오기 (초 단위)
     */
    getElapsedTime() {
        return (Date.now() - this.startTime) / 1000;
    }

    /**
     * 마지막 저장 시간 설정
     */
    setLastSavedTime(timestamp) {
        this.lastSavedTime = timestamp;
    }

    /**
     * 오프라인 시간 계산 (마지막 저장 후 경과 시간)
     */
    getOfflineTime() {
        if (!this.lastSavedTime) {
            return 0;
        }
        return (Date.now() - this.lastSavedTime) / 1000;
    }

    /**
     * 시간 포맷팅 (초를 시:분:초로 변환)
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 날짜 포맷팅
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('ko-KR');
    }

    /**
     * 두 시간 사이의 차이 계산 (초 단위)
     */
    getTimeDifference(timestamp1, timestamp2) {
        return Math.abs(timestamp2 - timestamp1) / 1000;
    }
}


