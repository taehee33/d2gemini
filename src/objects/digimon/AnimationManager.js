/**
 * 디지몬 애니메이션 관리 클래스
 * JSON 데이터를 기반으로 애니메이션을 재생합니다.
 * Phaser의 애니메이션 시스템을 사용합니다.
 */
export class AnimationManager {
    constructor(digimon, digimonList, animations) {
        this.digimon = digimon;
        this.scene = digimon.scene;
        this.digimonList = digimonList; // 디지몬 정보 배열
        this.animations = animations; // 애니메이션 패턴 객체
        
        // 현재 재생 중인 애니메이션
        this.currentAnimation = null;
        this.currentFrameIndex = 0;
        
        // 생성된 애니메이션 키 저장
        this.createdAnimations = new Set();
    }
    
    /**
     * 애니메이션 재생
     * @param {string} animationKey - 애니메이션 키 (예: 'idle', 'eat')
     * @param {string} speciesId - 디지몬 ID (예: 'botamon', 'koromon')
     * @param {object} options - 옵션 객체 { frameRate, repeat }
     */
    play(animationKey, speciesId, options = {}) {
        // 1. 배열에서 내 디지몬 정보 찾기 (find 사용)
        const speciesData = this.digimonList.find(d => d.id === speciesId);
        
        if (!speciesData) {
            console.error(`❌ 디지몬 데이터를 찾을 수 없음: ${speciesId}`);
            return;
        }
        
        // 2. 애니메이션 패턴 찾기
        const pattern = this.animations[animationKey];
        if (!pattern || !Array.isArray(pattern)) {
            console.error(`❌ 애니메이션 패턴을 찾을 수 없음: ${animationKey}`);
            return;
        }
        
        // 3. 프레임 번호 계산 (String 변환 필수)
        const frames = pattern.map(num => {
            // 공식: 시작번호 + (패턴번호 - 1)
            const frameNumber = speciesData.start_frame + (num - 1);
            return { key: `digimon_${frameNumber}` };
        });
        
        // 4. 애니메이션 생성 및 재생
        const animKey = `${speciesId}_${animationKey}`;
        
        // 이미 존재하면 삭제하고 다시 만듦 (옵션 변경 대응)
        if (this.scene.anims.exists(animKey)) {
            this.scene.anims.remove(animKey);
        }
        
        this.scene.anims.create({
            key: animKey,
            frames: frames,
            frameRate: options.frameRate || 3, // 기본 속도
            repeat: options.repeat !== undefined ? options.repeat : -1
        });
        
        // 5. 확실하게 재생 (첫 프레임 강제 설정)
        if (this.digimon.digimonSprite) {
            this.digimon.digimonSprite.anims.stop();
            this.digimon.digimonSprite.setTexture(frames[0].key); // 첫 이미지로 즉시 변경
            // ignoreIfPlaying: false로 무조건 재생 (안전장치)
            this.digimon.digimonSprite.play(animKey, false);
        }
        
        // 현재 애니메이션 정보 저장
        this.currentAnimation = animationKey;
        this.currentDigimonId = speciesId;
    }
    
    /**
     * Phaser 애니메이션 생성
     * @param {string} animKey - 애니메이션 키
     * @param {number} startFrame - 시작 프레임
     * @param {number[]} pattern - 프레임 패턴 배열
     * @param {number} frameRate - 프레임 속도
     * @param {number} repeat - 반복 횟수 (-1 = 무한)
     */
    createAnimation(animKey, startFrame, pattern, frameRate, repeat) {
        // 프레임 배열 생성
        const frames = pattern.map(patternNum => {
            const frameNumber = startFrame + (patternNum - 1);
            const textureKey = `digimon_${frameNumber}`;
            return { key: textureKey, frame: 0 };
        });
        
        // Phaser 애니메이션 생성
        this.scene.anims.create({
            key: animKey,
            frames: frames,
            frameRate: frameRate,
            repeat: repeat
        });
    }
    
    /**
     * 특정 프레임 표시
     * @param {number} startFrame - 디지몬의 시작 프레임
     * @param {number} patternNumber - 패턴 배열의 숫자
     */
    showFrame(startFrame, patternNumber) {
        // 공식: 최종_파일명 = start_frame + (패턴숫자 - 1)
        const frameNumber = startFrame + (patternNumber - 1);
        const textureKey = `digimon_${frameNumber}`;
        
        // 스프라이트 텍스처 변경
        if (this.digimon.digimonSprite && this.scene.textures.exists(textureKey)) {
            this.digimon.digimonSprite.setTexture(textureKey);
        } else {
            console.warn(`텍스처를 찾을 수 없습니다: ${textureKey}`);
        }
    }
    
    /**
     * 애니메이션 시퀀스 재생
     * @param {number} startFrame - 디지몬의 시작 프레임
     * @param {number[]} pattern - 프레임 패턴 배열
     */
    playAnimationSequence(startFrame, pattern) {
        let frameIndex = 0;
        let animationTimer = null;
        
        // 프레임 간격 계산 (밀리초 단위)
        // frameRate가 1 fps면 1000ms, 2 fps면 500ms
        const frameDelay = 1000 / this.currentFrameRate;
        
        const playNextFrame = () => {
            if (frameIndex < pattern.length) {
                this.showFrame(startFrame, pattern[frameIndex]);
                frameIndex++;
                
                // 다음 프레임으로 (frameRate에 따른 간격)
                animationTimer = this.scene.time.delayedCall(frameDelay, playNextFrame);
            } else {
                // 애니메이션 완료
                this.onAnimationComplete();
            }
        };
        
        // 첫 프레임은 이미 표시되었으므로 다음부터 시작
        frameIndex = 1;
        if (frameIndex < pattern.length) {
            animationTimer = this.scene.time.delayedCall(frameDelay, playNextFrame);
        } else {
            // 패턴이 1개만 있으면 즉시 완료 처리
            this.onAnimationComplete();
        }
        
        // 타이머 저장 (나중에 정리 가능하도록)
        this.currentAnimationTimer = animationTimer;
    }
    
    /**
     * 애니메이션 완료 시 호출
     * idle 애니메이션으로 복귀 (eat 애니메이션이 아닐 때만)
     */
    onAnimationComplete() {
        // 완료 콜백 실행
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
            this.onCompleteCallback = null;
        }
        
        // 현재 애니메이션 초기화
        const completedAnimation = this.currentAnimation;
        this.currentAnimation = null;
        this.currentFrameIndex = 0;
        
        // eat 애니메이션이 아니면 idle로 복귀
        if (completedAnimation !== 'eat') {
            const digimonId = this.digimon.data.currentDigimonId || 'botamon';
            this.play('idle', digimonId);
        } else {
            // eat 애니메이션 완료 후 idle로 복귀
            const digimonId = this.digimon.data.currentDigimonId || 'botamon';
            this.play('idle', digimonId);
        }
    }
    
    /**
     * 애니메이션 중지
     */
    stop() {
        this.currentAnimation = null;
        this.currentFrameIndex = 0;
    }
}

