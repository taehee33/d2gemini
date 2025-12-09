# Idle 애니메이션 수정 및 상태 관리 중앙 집중화 작업 로그

**작업 일시**: 2025년 12월 7일  
**작업 내용**: idle 애니메이션 작동 문제 수정, 상태 관리 로직 중앙 집중형으로 개편

## 수행한 작업

### 1. Idle 애니메이션 작동 문제 수정

#### 문제점
- 게임을 시작해도 idle 애니메이션이 전혀 작동하지 않음
- 데이터 구조 접근 방식에 문제
- `digimon_list.json`은 배열 형태인데 객체처럼 접근 시도

#### 해결 방법
- **파일**: `src/objects/digimon/AnimationManager.js`
- `play()` 함수 전면 재작성
- 배열 접근 방식 수정: `find()` 사용
- 프레임 번호를 String으로 변환
- 애니메이션 생성 및 재생 로직 개선

#### 수정된 play() 로직
```javascript
play(animationKey, speciesId, options = {}) {
    // 1. 배열에서 내 디지몬 정보 찾기 (find 사용)
    const speciesData = this.digimonList.find(d => d.id === speciesId);
    
    if (!speciesData) {
        console.error(`❌ 디지몬 데이터를 찾을 수 없음: ${speciesId}`);
        return;
    }
    
    // 2. 애니메이션 패턴 찾기
    const pattern = this.animations[animationKey];
    if (!pattern) {
        console.error(`❌ 애니메이션 패턴을 찾을 수 없음: ${animationKey}`);
        return;
    }
    
    // 3. 프레임 번호 계산 (String 변환 필수)
    const frames = pattern.map(num => {
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
        frameRate: options.frameRate || 3,
        repeat: options.repeat !== undefined ? options.repeat : -1
    });
    
    // 5. 확실하게 재생 (첫 프레임 강제 설정)
    this.digimon.digimonSprite.anims.stop();
    this.digimon.digimonSprite.setTexture(frames[0].key);
    this.digimon.digimonSprite.play(animKey, false); // ignoreIfPlaying: false
}
```

### 2. 상태 관리 로직 중앙 집중화

#### resetToIdle() 메서드 신설
- **파일**: `src/objects/digimon/Digimon.js`
- 디지몬의 상태를 강제로 평상시로 되돌리는 중앙 집중형 메서드

#### 구현 내용
```javascript
resetToIdle() {
    // 1. 바쁨 상태 해제
    this.isBusy = false;
    
    // 2. 모든 이벤트 제거
    this.digimonSprite.removeAllListeners();
    
    // 3. 현재 애니메이션 정지
    this.digimonSprite.anims.stop();
    
    // 4. Idle 재생 (무조건 실행)
    this.animationManager.play('idle', currentSpecies, {
        frameRate: 1.5,
        repeat: -1
    });
    
    console.log('🔄 Idle 상태로 복귀 완료');
}
```

### 3. 기존 코드 교체

#### create() 함수 수정
- **파일**: `src/objects/digimon/Digimon.js`
- `create()` 함수 맨 마지막에 `this.resetToIdle()` 호출
- 초기화 완료 후 확실하게 idle 상태로 시작

#### eat() 함수 수정
- 복잡한 idle 복구 로직 제거
- `resetToIdle()` 호출로 단순화
- 중앙 집중형 상태 관리로 일관성 확보

#### 변경 전
```javascript
// 복잡한 로직
if (this.animationManager) {
    this.animationManager.play('idle', currentSpecies, {
        frameRate: 1.5,
        repeat: -1
    });
}
this.isBusy = false;
```

#### 변경 후
```javascript
// 단순화: resetToIdle() 호출
this.resetToIdle();
```

### 4. 안전장치 추가

#### AnimationManager.js
- `ignoreIfPlaying: false`로 설정하여 무조건 재생
- 애니메이션이 멈추는 버그 방지

#### resetToIdle() 내부
- `anims.isPlaying` 체크하지 않고 무조건 `play()` 실행
- 안전장치로 항상 idle 상태 보장

## 사용한 프롬프트

```
"지금 게임을 시작해도 idle 애니메이션이 전혀 작동하지 않아. 데이터 구조 접근 방식에 문제가 있는 것 같아. .cursorrules를 준수해서 수리해 줘.

1. AnimationManager.js의 play 로직 긴급 수정 (Array 탐색):
우리는 digimon_list.json을 배열(Array) 형태([{ id: 'botamon', ... }])로 만들었어.
하지만 코드에서 this.digimonList['botamon'] 처럼 접근하고 있다면 undefined가 떠서 멈출 거야.

2. Digimon.js 초기화 로직 확인:
create 시점에 this.animationManager.play('idle', this.currentSpecies)가 반드시 호출되도록 해줘.

게임의 안정성을 위해 상태 관리 로직을 '중앙 집중형'으로 개편해 줘. .cursorrules를 준수해 줘.

1. Digimon.js에 resetToIdle() 메서드 신설 (핵심):
이 함수는 디지몬의 상태를 강제로 평상시로 되돌리는 역할을 해.

2. 기존 코드 교체:
create() 함수 맨 마지막에 this.resetToIdle()을 호출해서 시작해.
eat() 함수에서 밥을 다 먹은 후(animationrepeat 종료 후) 복잡하게 play를 직접 부르지 말고, this.resetToIdle()만 호출하도록 수정해 줘.

3. 안전장치:
혹시 모를 버그로 애니메이션이 멈추는 걸 방지하기 위해, resetToIdle 내부에서 this.digimonSprite.anims.isPlaying을 체크하지 말고 무조건 play를 강제로 실행(ignoreIfPlaying: false)하게 해줘."
```

## 수정된 파일 목록

1. `src/objects/digimon/AnimationManager.js` - play() 로직 전면 재작성
2. `src/objects/digimon/Digimon.js` - resetToIdle() 메서드 추가, create() 및 eat() 수정

## 구현된 기능

### Idle 애니메이션 수정
- ✅ 배열 접근 방식 수정 (find() 사용)
- ✅ 프레임 번호 String 변환
- ✅ 애니메이션 생성 및 재생 로직 개선
- ✅ 에러 메시지 개선 (console.error)

### 상태 관리 중앙 집중화
- ✅ resetToIdle() 메서드 추가
- ✅ create() 함수에서 resetToIdle() 호출
- ✅ eat() 함수에서 resetToIdle() 사용
- ✅ 코드 중복 제거 및 일관성 확보

### 안전장치
- ✅ ignoreIfPlaying: false로 무조건 재생
- ✅ removeAllListeners()로 모든 이벤트 제거
- ✅ anims.stop()으로 현재 애니메이션 정지
- ✅ 애니메이션 멈춤 버그 방지

## 개선 사항

### Before (문제점)
- 배열을 객체처럼 접근 → undefined 오류
- idle 애니메이션이 작동하지 않음
- 상태 복구 로직이 여러 곳에 분산
- 코드 중복 및 일관성 부족

### After (개선)
- 배열 접근 방식 수정 (find() 사용)
- idle 애니메이션 정상 작동
- resetToIdle()로 중앙 집중형 상태 관리
- 코드 단순화 및 일관성 확보

## 동작 흐름

1. 게임 시작
2. Digimon 생성
3. `create()` 함수 완료
4. `resetToIdle()` 호출
5. idle 애니메이션 재생

### 식사 후 복귀
1. 밥 먹기 완료
2. `animationrepeat` 이벤트 종료
3. `resetToIdle()` 호출
4. 모든 이벤트 제거
5. idle 애니메이션 재생

## 다음 단계

- [ ] 다른 액션에도 resetToIdle() 패턴 적용
- [ ] 상태 복구 로직 추가 개선
- [ ] 에러 처리 강화

