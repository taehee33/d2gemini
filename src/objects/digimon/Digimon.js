import { StatusManager } from './StatusManager.js';
import { EvolutionManager } from './EvolutionManager.js';
import { AnimationManager } from './AnimationManager.js';

/**
 * 디지몬 메인 컨테이너 클래스
 * Phaser.GameObjects.Container를 상속하여 디지몬의 모든 요소를 관리합니다.
 * 본체(사장님)로서 모든 데이터를 가지고 있고, 부품(매니저)들에게 this를 넘겨줍니다.
 */
export class Digimon extends Phaser.GameObjects.Container {
    constructor(scene, x, y, digimonList, animations) {
        super(scene, x, y);
        
        this.scene = scene;
        
        // 1. 내 데이터(공유 자원) - 본체가 모든 데이터를 소유
        this.data = {
            hunger: 100,      // 배고픔 (0-100, 높을수록 배부름)
            strength: 0,      // 근력
            happiness: 50,    // 행복도
            age: 0,           // 나이 (초 단위)
            isSleeping: false, // 잠자는 상태
            currentDigimonId: 'botamon', // 현재 디지몬 ID
            training: 0       // 훈련 횟수 (진화 조건용)
        };
        
        // 애니메이션 중복 실행 방지 플래그
        this.isBusy = false;
        
        // 고기 스프라이트 및 타이머 참조
        this.meatSprite = null;
        this.meatTimer = null;
        
        // 2. 매니저(부품) 채용하면서 'this(나)'를 넘겨줌!
        this.statusManager = new StatusManager(this);
        this.evolutionManager = new EvolutionManager(scene, this);
        this.animationManager = new AnimationManager(this, digimonList, animations);
        
        // 디지몬 시각적 표현 (스프라이트 이미지 사용)
        // 기본 디지몬: botamon (210.png)
        this.digimonSprite = scene.add.sprite(0, 0, 'digimon_210');
        this.add(this.digimonSprite);
        
        // 기본 idle 애니메이션 재생
        if (this.animationManager) {
            this.animationManager.play('idle', 'botamon');
        }
        
        // 배고픔 수치 표시 텍스트 (디지몬 위쪽에 표시)
        this.hungerText = scene.add.text(0, -80, `배고픔: ${Math.floor(this.data.hunger)}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        this.add(this.hungerText); // Container에 추가하여 함께 이동
        
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
        
        // 배고픔 텍스트 실시간 업데이트
        if (this.hungerText) {
            this.hungerText.setText(`배고픔: ${Math.floor(this.data.hunger)}`);
            
            // 배고픔에 따라 텍스트 색상 변경
            if (this.data.hunger > 50) {
                this.hungerText.setColor('#00ff00'); // 초록색 (배부름)
            } else if (this.data.hunger > 20) {
                this.hungerText.setColor('#ffff00'); // 노란색 (보통)
            } else {
                this.hungerText.setColor('#ff0000'); // 빨간색 (배고픔)
            }
        }
    }
    
    /**
     * 디지몬 상태 가져오기
     */
    getStatus() {
        return { ...this.data };
    }
    
    /**
     * 밥 먹기 액션
     * isBusy 상태를 체크하여 중복 실행을 방지합니다.
     * animationrepeat 이벤트를 사용하여 디지몬 씹는 박자와 고기가 줄어드는 박자를 동기화합니다.
     */
    eat() {
        try {
            // A. 상태 잠금: 이미 애니메이션이 재생 중이면 무시
            if (this.isBusy) {
                console.log('⚠️ 이미 애니메이션이 재생 중입니다.');
                return;
            }
            
            // A. busy 상태로 설정
            this.isBusy = true;
            
            // 기존 리스너 제거 (off)
            if (this.digimonSprite) {
                this.digimonSprite.off('animationrepeat');
            }
            
            // 배고픔 증가
            this.statusManager.eat();
            
            // B. 고기 스프라이트 생성 (왼쪽 위치)
            if (this.meatSprite) {
                this.meatSprite.destroy();
            }
            const meatX = -50;
            const meatY = 0;
            this.meatSprite = this.scene.add.sprite(meatX, meatY, 'meat_526');
            this.add(this.meatSprite); // Container에 추가하여 함께 이동
            
            // C. 고기 단계 배열 정의: [526, 527, 528, 529]
            this.meatFrames = [526, 527, 528, 529];
            this.currentMeatIndex = 0;
            
            // D. 애니메이션 실행: play('eat', this.currentSpecies, { frameRate: 3, repeat: -1 })
            const currentSpecies = this.data.currentDigimonId || 'botamon';
            if (this.animationManager) {
                this.animationManager.play('eat', currentSpecies, {
                    frameRate: 3,  // 2에서 3으로 증가 (1.3~1.5배 빠르게)
                    repeat: -1  // 무한 반복
                });
            }
            
            // E. 이벤트 리스너 (sprite.on('animationrepeat'))
            if (this.digimonSprite) {
                this.digimonSprite.on('animationrepeat', () => {
                    try {
                        // 디지몬이 한 번 씹을 때마다(반복될 때마다) 고기 인덱스를 +1
                        if (this.currentMeatIndex < this.meatFrames.length && this.meatSprite) {
                            this.currentMeatIndex++;
                            
                            // 고기 텍스처를 다음 단계로 업데이트
                            if (this.currentMeatIndex < this.meatFrames.length) {
                                const frameNumber = this.meatFrames[this.currentMeatIndex];
                                this.meatSprite.setTexture(`meat_${frameNumber}`);
                            }
                        }
                        
                        // 종료 조건: 고기 인덱스가 배열 끝을 넘어가면?
                        if (this.currentMeatIndex >= this.meatFrames.length) {
                            // 1. 고기 destroy()
                            if (this.meatSprite) {
                                this.meatSprite.destroy();
                                this.meatSprite = null;
                            }
                            
                            // 2. 리스너 제거 (sprite.off('animationrepeat'))
                            if (this.digimonSprite) {
                                this.digimonSprite.off('animationrepeat');
                            }
                            
                            // 3. 중요: play('idle', this.currentSpecies, { frameRate: 1.5, repeat: -1 })
                            // 여기서 반드시 frameRate를 1.5 정도로 낮춰서 명시해야 빨라지는 버그가 해결됨
                            if (this.animationManager) {
                                this.animationManager.play('idle', currentSpecies, {
                                    frameRate: 1.5,
                                    repeat: -1
                                });
                            }
                            
                            // 4. isBusy = false
                            this.isBusy = false;
                        }
                    } catch (error) {
                        console.error('animationrepeat 이벤트 처리 중 오류:', error);
                        // 오류 발생 시에도 잠금 해제
                        this.isBusy = false;
                        if (this.meatSprite) {
                            this.meatSprite.destroy();
                            this.meatSprite = null;
                        }
                        if (this.digimonSprite) {
                            this.digimonSprite.off('animationrepeat');
                        }
                    }
                });
            }
            
        } catch (error) {
            console.error('eat() 함수 실행 중 오류:', error);
            // 오류 발생 시 잠금 해제
            this.isBusy = false;
            if (this.meatSprite) {
                this.meatSprite.destroy();
                this.meatSprite = null;
            }
            if (this.digimonSprite) {
                this.digimonSprite.off('animationrepeat');
            }
        }
    }
}

