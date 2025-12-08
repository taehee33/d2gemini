# 식사 로직 전면 수정 작업 로그

**작업 일시**: 2025년 12월 7일  
**작업 내용**: animationrepeat 이벤트 사용, 디지몬 씹는 박자와 고기 줄어드는 박자 동기화, idle 애니메이션 속도 버그 수정

## 수행한 작업

### 1. 기존 문제점

#### 문제점 1: 박자 불일치
- TimerEvent로 고기를 줄이니 디지몬이 씹는 박자와 고기가 줄어드는 박자가 안 맞음
- 독립적인 타이머로 인한 동기화 문제

#### 문제점 2: 애니메이션 속도 버그
- 식사 후 'idle' 상태로 돌아오면 애니메이션 속도가 비정상적으로 빨라짐
- frameRate가 명시되지 않아 기본값 사용

### 2. 해결 전략: animationrepeat 이벤트 사용

#### 변경 사항
- **파일**: `src/objects/digimon/Digimon.js`
- `Phaser.Time.addEvent` 타이머 삭제
- `animationrepeat` 이벤트 리스너 등록
- 디지몬 eat 애니메이션 한 사이클(1->10->9) 완료 시마다 고기 단계 변경

### 3. AnimationManager.js 수정

#### Phaser 애니메이션 시스템 적용
- `anims.create()` 사용하여 애니메이션 생성
- `frameRate`와 `repeat` 옵션 지원
- 옵션 객체 형태로 파라미터 전달

#### 변경된 play() 메서드
```javascript
play(animationKey, digimonId = 'botamon', options = {}, onComplete = null) {
    // 옵션 파싱
    let frameRate = options.frameRate || 5;
    let repeat = options.repeat !== undefined ? options.repeat : 0;
    
    // Phaser 애니메이션 생성 및 재생
    this.scene.anims.create({
        key: animKey,
        frames: frames,
        frameRate: frameRate,
        repeat: repeat
    });
    
    this.digimon.digimonSprite.play(animKey);
}
```

### 4. Digimon.js의 eat() 함수 재작성

#### 구현 순서

**A. isBusy = true 설정 및 기존 리스너 제거**
```javascript
if (this.isBusy) return;
this.isBusy = true;
this.digimonSprite.off('animationrepeat');
```

**B. 고기 스프라이트(526) 생성 (왼쪽 위치)**
```javascript
this.meatSprite = this.scene.add.sprite(-50, 0, 'meat_526');
this.add(this.meatSprite);
```

**C. 고기 단계 배열 정의**
```javascript
this.meatFrames = [526, 527, 528, 529];
this.currentMeatIndex = 0;
```

**D. 애니메이션 실행 (무한 반복, 느린 속도)**
```javascript
this.animationManager.play('eat', currentSpecies, {
    frameRate: 2,
    repeat: -1  // 무한 반복
});
```

**E. 이벤트 리스너 (animationrepeat)**
```javascript
this.digimonSprite.on('animationrepeat', () => {
    // 디지몬이 한 번 씹을 때마다 고기 인덱스 +1
    this.currentMeatIndex++;
    
    // 고기 텍스처 업데이트
    if (this.currentMeatIndex < this.meatFrames.length) {
        const frameNumber = this.meatFrames[this.currentMeatIndex];
        this.meatSprite.setTexture(`meat_${frameNumber}`);
    }
    
    // 종료 조건: 배열 끝을 넘어가면
    if (this.currentMeatIndex >= this.meatFrames.length) {
        // 1. 고기 destroy()
        // 2. 리스너 제거
        // 3. play('idle', { frameRate: 1.5, repeat: -1 })
        // 4. isBusy = false
    }
});
```

## 사용한 프롬프트

```
"식사 로직을 전면 수정해서 자연스러운 연출과 버그를 동시에 잡자. .cursorrules를 준수해 줘.

1. 기존 문제점:
TimerEvent로 고기를 줄이니 디지몬이 씹는 박자와 고기가 줄어드는 박자가 안 맞음.
식사 후 'idle' 상태로 돌아오면 애니메이션 속도가 비정상적으로 빨라짐.

2. 해결 전략: '애니메이션 반복 이벤트(animationrepeat)' 사용:
타이머(Phaser.Time.addEvent)를 삭제해.
대신, 디지몬이 eat 애니메이션 한 사이클(1->10->9)을 완료하고 반복할 때 발생하는 animationrepeat 이벤트를 리스너로 등록해.

3. Digimon.js의 eat() 함수 재작성 로직:
A. isBusy = true 설정 및 기존 리스너 제거(off).
B. 고기 스프라이트(526) 생성 (왼쪽 위치).
C. 고기 단계 배열 정의: [526, 527, 528, 529]. 현재 인덱스 0.
D. 애니메이션 실행: play('eat', this.currentSpecies, { frameRate: 2, repeat: -1 })
E. 이벤트 리스너 (sprite.on('animationrepeat')): 디지몬이 한 번 씹을 때마다 고기 인덱스 +1, 고기 텍스처 업데이트, 종료 조건 처리

4. AnimationManager.js 수정:
play 함수가 frameRate와 repeat 옵션을 인자로 받을 수 있도록 수정해서 Phaser의 anims.create나 play에 전달해 줘.
```

## 수정된 파일 목록

1. `src/objects/digimon/AnimationManager.js` - Phaser 애니메이션 시스템 적용, frameRate/repeat 옵션 추가
2. `src/objects/digimon/Digimon.js` - eat() 함수 전면 재작성, animationrepeat 이벤트 사용

## 구현된 기능

### 박자 동기화
- ✅ `animationrepeat` 이벤트로 디지몬 씹는 박자와 고기 줄어드는 박자 동기화
- ✅ TimerEvent 제거로 독립적인 타이머 문제 해결
- ✅ 자연스러운 식사 연출

### 애니메이션 속도 버그 수정
- ✅ idle 애니메이션에 `frameRate: 1.5` 명시
- ✅ 애니메이션 속도가 비정상적으로 빨라지는 문제 해결
- ✅ 모든 애니메이션에 frameRate 옵션 적용 가능

### 코드 구조 개선
- ✅ Phaser 애니메이션 시스템 사용
- ✅ 옵션 객체 형태로 파라미터 전달
- ✅ 하위 호환성 유지 (구형 호출 방식 지원)

## 동작 흐름

1. 사용자가 밥 먹기 버튼 클릭
2. `digimon.eat()` 호출
3. `isBusy` 체크 및 설정
4. 고기 스프라이트 생성 (526)
5. eat 애니메이션 재생 (frameRate: 2, repeat: -1)
6. `animationrepeat` 이벤트 발생:
   - 고기 인덱스 +1
   - 고기 텍스처 업데이트 (526 → 527 → 528 → 529)
   - 마지막 단계 도달 시:
     - 고기 destroy()
     - 리스너 제거
     - idle 애니메이션 재생 (frameRate: 1.5, repeat: -1)
     - `isBusy = false`

## 개선 사항

### Before (문제점)
- TimerEvent로 고기 줄이기 → 박자 불일치
- idle 애니메이션 속도 버그
- 독립적인 타이머로 인한 동기화 문제

### After (개선)
- `animationrepeat` 이벤트 사용 → 박자 완벽 동기화
- frameRate 명시로 속도 버그 해결
- 자연스러운 식사 연출

## 다음 단계

- [ ] 다른 애니메이션에도 동일한 패턴 적용
- [ ] 애니메이션 속도 조절 UI 추가
- [ ] 식사 연출 효과 개선

