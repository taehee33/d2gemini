/**
 * 디지몬 상태 관리 클래스
 * 배고픔, 근력 등 다양한 수치를 관리합니다.
 * 부품(직원)으로서 사장님(digimon)의 데이터를 직접 관리합니다.
 */
export class StatusManager {
    constructor(digimon) {
        // 사장님을 기억해둠
        this.digimon = digimon;
        
        // 1초마다 배고픔을 감소시키기 위한 타이머
        this.hungerDecreaseTimer = 0;
        this.hungerDecreaseInterval = 1000; // 1초 = 1000밀리초
    }
    
    /**
     * 상태 업데이트 (매 프레임 호출)
     * 사장님의 데이터에 직접 접근해서 수정
     */
    update(time, delta) {
        // delta는 밀리초 단위
        
        // 1초마다 배고픔 5씩 감소
        this.hungerDecreaseTimer += delta;
        if (this.hungerDecreaseTimer >= this.hungerDecreaseInterval) {
            // 사장님의 데이터에 직접 접근해서 수정
            this.digimon.data.hunger = Math.max(0, this.digimon.data.hunger - 5);
            this.hungerDecreaseTimer = 0; // 타이머 리셋
            
            if (this.digimon.data.hunger <= 0) {
                console.log("사장님(디지몬)이 배고파서 쓰러졌습니다!");
            }
        }
        
        // 나이 증가 (매 프레임마다 조금씩)
        this.digimon.data.age += delta / 1000; // 밀리초를 초로 변환
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

