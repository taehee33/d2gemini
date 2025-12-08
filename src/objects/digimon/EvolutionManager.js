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
        
        // 진화 조건 정의 (테스트를 위해 조건을 높임)
        this.evolutionConditions = {
            child: {
                age: 10,        // 10초 이상
                hunger: 50,     // 배고픔 50 이상
                training: 10    // 훈련 10 이상 (테스트용)
            },
            adult: {
                age: 60,        // 60초 이상
                hunger: 70,     // 배고픔 70 이상
                strength: 10,   // 근력 10 이상
                training: 20    // 훈련 20 이상
            }
            // 추가 진화 단계는 나중에 구현
        };
    }
    
    /**
     * 진화 조건 확인 및 진화 처리
     */
    checkEvolution() {
        // 현재 디지몬 ID를 기반으로 다음 진화 단계 결정
        const currentId = this.digimon.data.currentDigimonId || 'botamon';
        const nextSpeciesId = this.getNextSpeciesId(currentId);
        
        if (nextSpeciesId && this.canEvolveTo(this.getStageFromSpeciesId(currentId))) {
            this.evolveTo(nextSpeciesId);
        }
    }
    
    /**
     * 다음 진화 단계 가져오기 (스테이지 기반)
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
     * 현재 종 ID에서 다음 종 ID 가져오기
     */
    getNextSpeciesId(currentId) {
        const evolutionChain = {
            'botamon': 'koromon',
            'koromon': 'agumon',
            'agumon': null // 더 이상 진화 없음
        };
        return evolutionChain[currentId] || null;
    }
    
    /**
     * 종 ID에서 스테이지 가져오기
     */
    getStageFromSpeciesId(speciesId) {
        const stageMap = {
            'botamon': 'baby',
            'koromon': 'child',
            'agumon': 'adult'
        };
        return stageMap[speciesId] || 'baby';
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
            this.digimon.data.strength >= (conditions.strength || 0) &&
            (this.digimon.data.training || 0) >= (conditions.training || 0)
        );
    }
    
    /**
     * 진화 실행
     * @param {string} targetSpeciesId - 진화할 디지몬 종 ID (예: 'koromon', 'agumon')
     */
    evolveTo(targetSpeciesId) {
        // 1. 종 변경
        this.digimon.data.currentDigimonId = targetSpeciesId;
        
        // 2. 진화 연출 (선택사항: 'evolve' 애니메이션 재생 후 idle로)
        // 일단은 즉시 새로운 모습의 idle 상태로 전환
        if (this.digimon.animationManager) {
            this.digimon.animationManager.play('idle', targetSpeciesId);
        }
        
        // 3. 스프라이트 텍스처 변경
        const digimonList = this.digimon.animationManager?.digimonList;
        if (digimonList && this.digimon.digimonSprite) {
            const digimonInfo = digimonList.find(d => d.id === targetSpeciesId);
            if (digimonInfo) {
                const startFrame = digimonInfo.start_frame;
                const textureKey = `digimon_${startFrame}`;
                if (this.scene.textures.exists(textureKey)) {
                    this.digimon.digimonSprite.setTexture(textureKey);
                }
            }
        }
        
        console.log(`진화 성공! 새로운 디지몬: ${targetSpeciesId}`);
    }
    
    /**
     * 현재 진화 단계 반환
     */
    getCurrentStage() {
        return this.currentStage;
    }
}

