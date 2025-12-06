/**
 * 디지몬 진화 관리 클래스
 * 진화 조건을 판단하고 스프라이트를 변경합니다.
 */
export class EvolutionManager {
    constructor(scene, digimon) {
        this.scene = scene;
        this.digimon = digimon;
        
        // 현재 진화 단계
        this.currentStage = 'baby'; // baby, child, adult, perfect, ultimate
        
        // 진화 조건 정의 (예시)
        this.evolutionConditions = {
            child: {
                age: 10,        // 10초 이상
                hunger: 50      // 배고픔 50 이상
            },
            adult: {
                age: 60,        // 60초 이상
                hunger: 70,     // 배고픔 70 이상
                strength: 10    // 근력 10 이상
            }
            // 추가 진화 단계는 나중에 구현
        };
    }
    
    /**
     * 진화 조건 확인 및 진화 처리
     */
    checkEvolution() {
        const nextStage = this.getNextEvolutionStage();
        
        if (nextStage && this.canEvolveTo(nextStage)) {
            this.evolveTo(nextStage);
        }
    }
    
    /**
     * 다음 진화 단계 가져오기
     */
    getNextEvolutionStage() {
        const stages = ['baby', 'child', 'adult', 'perfect', 'ultimate'];
        const currentIndex = stages.indexOf(this.currentStage);
        
        if (currentIndex < stages.length - 1) {
            return stages[currentIndex + 1];
        }
        return null;
    }
    
    /**
     * 진화 가능 여부 확인
     * 사장님의 데이터에 직접 접근
     */
    canEvolveTo(stage) {
        const conditions = this.evolutionConditions[stage];
        if (!conditions) return false;
        
        // 사장님의 데이터에 직접 접근
        return (
            this.digimon.data.age >= (conditions.age || 0) &&
            this.digimon.data.hunger >= (conditions.hunger || 0) &&
            this.digimon.data.strength >= (conditions.strength || 0)
        );
    }
    
    /**
     * 진화 실행
     */
    evolveTo(stage) {
        this.currentStage = stage;
        
        // 스프라이트 변경 (현재는 색상만 변경)
        const colors = {
            baby: 0x00ff00,      // 초록색
            child: 0x0000ff,     // 파란색
            adult: 0xff0000,     // 빨간색
            perfect: 0xffff00,   // 노란색
            ultimate: 0xff00ff   // 마젠타
        };
        
        if (this.digimon.digimonSprite) {
            this.digimon.digimonSprite.setFillStyle(colors[stage] || 0xffffff);
        }
        
        console.log(`디지몬이 ${stage} 단계로 진화했습니다!`);
    }
    
    /**
     * 현재 진화 단계 반환
     */
    getCurrentStage() {
        return this.currentStage;
    }
}

