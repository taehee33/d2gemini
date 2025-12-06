import { StatusManager } from './StatusManager.js';
import { EvolutionManager } from './EvolutionManager.js';

/**
 * 디지몬 메인 컨테이너 클래스
 * Phaser.GameObjects.Container를 상속하여 디지몬의 모든 요소를 관리합니다.
 * 본체(사장님)로서 모든 데이터를 가지고 있고, 부품(매니저)들에게 this를 넘겨줍니다.
 */
export class Digimon extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        
        this.scene = scene;
        
        // 1. 내 데이터(공유 자원) - 본체가 모든 데이터를 소유
        this.data = {
            hunger: 100,      // 배고픔 (0-100, 높을수록 배부름)
            strength: 0,      // 근력
            happiness: 50,    // 행복도
            age: 0,           // 나이 (초 단위)
            isSleeping: false // 잠자는 상태
        };
        
        // 2. 매니저(부품) 채용하면서 'this(나)'를 넘겨줌!
        this.statusManager = new StatusManager(this);
        this.evolutionManager = new EvolutionManager(scene, this);
        
        // 디지몬 시각적 표현 (임시로 사각형 사용)
        this.digimonSprite = scene.add.rectangle(0, 0, 100, 100, 0x00ff00);
        this.add(this.digimonSprite);
        
        // 씬에 추가
        scene.add.existing(this);
    }
    
    /**
     * 업데이트 메서드 (매 프레임 호출)
     * 사장이 매니저들에게 "일해!" 라고 명령
     */
    update(time, delta) {
        // 상태 관리자 업데이트 (delta는 밀리초 단위)
        this.statusManager.update(time, delta);
        
        // 진화 조건 확인
        this.evolutionManager.checkEvolution();
    }
    
    /**
     * 디지몬 상태 가져오기
     */
    getStatus() {
        return { ...this.data };
    }
}

