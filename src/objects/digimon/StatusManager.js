/**
 * 디지몬 상태 관리 클래스
 * 배고픔, 근력 등 다양한 수치를 관리합니다.
 * 부품(직원)으로서 사장님(digimon)의 데이터를 직접 관리합니다.
 */
export class StatusManager {
    constructor(digimon) {
        // 사장님을 기억해둠
        this.digimon = digimon;
        this.scene = digimon.scene;
        
        // Date.now() 기반 시간 추적 (브라우저 탭 비활성화 시에도 동작)
        this.lastUpdateTime = Date.now();
        
        // 배고픔 감소 속도: 1초당 1 감소
        this.hungerDecreaseRate = 1; // 초당 감소량
    }
    
    /**
     * 상태 업데이트 (매 프레임 호출)
     * Date.now()를 사용하여 실제 경과 시간만큼 배고픔 감소
     */
    update(time, delta) {
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - this.lastUpdateTime) / 1000; // 경과 시간 (초)
        
        // 경과 시간만큼 배고픔 감소 (1초당 1 감소)
        if (elapsedSeconds > 0) {
            const hungerDecrease = elapsedSeconds * this.hungerDecreaseRate;
            this.digimon.data.hunger = Math.max(0, this.digimon.data.hunger - hungerDecrease);
            
            if (this.digimon.data.hunger <= 0) {
                console.warn("⚠️ 디지몬이 배고파서 쓰러졌습니다! 배고픔: 0");
            }
            
            // 마지막 업데이트 시간 갱신
            this.lastUpdateTime = currentTime;
        }
        
        // 나이 증가 (매 프레임마다 조금씩)
        this.digimon.data.age += delta / 1000; // 밀리초를 초로 변환
    }
    
    /**
     * 밥 먹기 기능
     * 배고픔을 10 증가시키고, 최대 100으로 제한
     */
    eat() {
        this.digimon.data.hunger = Math.min(100, this.digimon.data.hunger + 10);
        console.log(`🍽️ 밥을 먹었습니다! 배고픔: ${Math.floor(this.digimon.data.hunger)}`);
    }
    
    /**
     * 배고픔 수치 변경
     */
    setHunger(value) {
        this.digimon.data.hunger = Phaser.Math.Clamp(value, 0, 100);
    }
    
    /**
     * 근력 수치 변경
     */
    setStrength(value) {
        this.digimon.data.strength = Math.max(0, value);
    }
    
    /**
     * 행복도 수치 변경
     */
    setHappiness(value) {
        this.digimon.data.happiness = Phaser.Math.Clamp(value, 0, 100);
    }
}

