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
     * @param {string} digimonId - 디지몬 ID (예: 'botamon', 'koromon')
     * @param {number|object} options - 프레임 속도 (fps) 또는 옵션 객체 { frameRate, repeat }
     * @param {Function} onComplete - 애니메이션 완료 시 호출될 콜백 (deprecated, 이벤트 사용 권장)
     */
    play(animationKey, digimonId = 'botamon', options = {}, onComplete = null) {
        // 옵션 파싱 (하위 호환성)
        let frameRate = 5;
        let repeat = 0; // 0 = 한 번만, -1 = 무한 반복
        
        if (typeof options === 'number') {
            // 구형 호출 방식: play(key, id, frameRate)
            frameRate = options;
        } else if (typeof options === 'object') {
            // 신형 호출 방식: play(key, id, { frameRate, repeat })
            frameRate = options.frameRate || 5;
            repeat = options.repeat !== undefined ? options.repeat : 0;
        }
        
        // 1. digimon_list에서 digimonId에 해당하는 start_frame 찾기
        const digimonInfo = this.digimonList.find(d => d.id === digimonId);
        if (!digimonInfo) {
            console.error(`디지몬 ID를 찾을 수 없습니다: ${digimonId}`);
            return;
        }
        
        const startFrame = digimonInfo.start_frame;
        
        // 2. animations에서 animationKey에 해당하는 배열(패턴) 가져오기
        const pattern = this.animations[animationKey];
        if (!pattern || !Array.isArray(pattern)) {
            console.error(`애니메이션 패턴을 찾을 수 없습니다: ${animationKey}`);
            return;
        }
        
        // 3. 애니메이션 키 생성
        const animKey = `${digimonId}_${animationKey}`;
        
        // 4. 애니메이션이 없으면 생성
        if (!this.createdAnimations.has(animKey)) {
            this.createAnimation(animKey, startFrame, pattern, frameRate, repeat);
            this.createdAnimations.add(animKey);
        }
        
        // 5. 현재 애니메이션 정보 저장
        this.currentAnimation = animationKey;
        this.currentDigimonId = digimonId;
        
        // 6. 안전장치: 첫 번째 프레임으로 즉시 텍스처 변경
        // 애니메이션이 바뀌는 순간 이전 이미지 잔상이 남거나 멈춰 보이는 현상을 막기 위함
        if (this.digimon.digimonSprite) {
            const firstPatternNum = pattern[0];
            const firstFrameNumber = startFrame + (firstPatternNum - 1);
            const firstTextureKey = `digimon_${firstFrameNumber}`;
            
            if (this.scene.textures.exists(firstTextureKey)) {
                this.digimon.digimonSprite.setTexture(firstTextureKey);
            }
        }
        
        // 7. 애니메이션 재생
        if (this.digimon.digimonSprite) {
            this.digimon.digimonSprite.play(animKey);
        }
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

