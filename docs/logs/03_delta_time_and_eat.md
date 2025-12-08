# Delta Time 적용 및 밥 먹기 기능 구현 로그

**작업 일시**: 2025년 12월 7일  
**작업 내용**: Date.now() 기반 시간 로직, 스프라이트 적용, 밥 먹기 기능 구현

## 수행한 작업

### 1. 시간 로직 수정 (Delta Time 적용)

#### 문제점
- 브라우저 탭이 비활성화되면 `Phaser.Time.TimerEvent`가 멈추는 문제 발생
- 실제 시간과 게임 시간이 동기화되지 않음

#### 해결 방법
- **파일**: `src/objects/digimon/StatusManager.js`
- `Phaser.Time.TimerEvent` 제거
- `Date.now()` 기반 시간 추적으로 변경
- `update()` 메서드에서 경과 시간 계산:
  ```javascript
  const currentTime = Date.now();
  const elapsedSeconds = (currentTime - this.lastUpdateTime) / 1000;
  const hungerDecrease = elapsedSeconds * this.hungerDecreaseRate; // 1초당 1 감소
  ```

#### 장점
- 브라우저 탭이 비활성화되어도 실제 시간 기준으로 배고픔 감소
- 실제 시간과 게임 시간 동기화 가능

### 2. 스프라이트 적용

#### 변경 사항
- **파일**: `src/objects/digimon/Digimon.js`
- 기존 사각형(`rectangle`) 제거
- 스프라이트 이미지 사용: `scene.add.sprite(0, 0, 'digimon_210')`
- 기본 디지몬: botamon (210.png)

#### 이미지 로드
- **파일**: `src/scenes/GameScene.js`
- `preload()` 메서드에서 210~255 범위 이미지 로드
- 각 이미지를 개별 키로 등록 (`digimon_210`, `digimon_211`, ...)

### 3. 밥 먹기 기능 구현

#### StatusManager에 eat() 메서드 추가
- **파일**: `src/objects/digimon/StatusManager.js`
- 배고픔을 10 증가 (최대 100 제한)
- 콘솔에 로그 출력

#### GameScene에 밥 먹기 버튼 추가
- **파일**: `src/scenes/GameScene.js`
- 화면 하단 중앙에 버튼 배치
- 클릭 시 `digimon.statusManager.eat()` 실행
- 호버 효과 추가 (색상 변경)
- 버튼 클릭 시 eat 애니메이션 재생

### 4. 데이터 파일 분리 및 애니메이션 시스템

#### JSON 데이터 파일 생성
- **파일**: `src/data/digimon_list.json`
  - 디지몬 정보 (id, name, start_frame)
  - botamon(210), koromon(225), agumon(240)

- **파일**: `src/data/animations.json`
  - 공통 동작 패턴 정의
  - idle, eat, refuse, train_ready 등 15가지 애니메이션

#### AnimationManager 생성
- **파일**: `src/objects/digimon/AnimationManager.js`
- JSON 데이터를 기반으로 애니메이션 재생
- 프레임 계산 공식: `최종_파일명 = start_frame + (패턴숫자 - 1)`
- 예: 아구몬(240)이 battle_lose(2, 15)를 할 때
  - 첫 프레임: 240 + (2 - 1) = 241.png
  - 둘째 프레임: 240 + (15 - 1) = 254.png

#### GameScene에 JSON 로드 추가
- `preload()`에서 `digimon_list.json`, `animations.json` 로드
- `create()`에서 JSON 데이터를 Digimon에 전달
- AnimationManager 초기화

## 사용한 프롬프트

```
"중요한 수정 사항이 있어. .cursorrules를 참고해서 진행해 줘.

1. 시간 로직 수정 (Delta Time 적용):
브라우저 탭이 비활성화되면 타이머가 멈추는 문제가 있어. StatusManager.js를 수정해 줘.
Phaser.Time.TimerEvent 대신 Date.now()를 사용해야 해.
update 함수에서 (현재 시간 - 마지막 업데이트 시간)을 계산해서, 흐른 시간만큼 배고픔을 감소시키는 로직으로 변경해 줘. (예: 1초당 배고픔 1 감소)

2. 스프라이트 적용:
기존의 사각형(Rectangle)을 지우고, 로드한 스프라이트 이미지를 띄우도록 수정해 줘.

3. 밥 먹기 기능 구현:
StatusManager.js에 eat() 메서드를 추가해 (배고픔 +10, 최대 100 제한).
GameScene 화면 하단에 '밥 먹기' 버튼(텍스트 혹은 이미지)을 만들어줘.
버튼을 누르면 digimon.statusManager.eat()이 실행되고, 화면의 배고픔 수치 텍스트가 즉시 업데이트되게 해줘.

프로젝트 규칙(.cursorrules)에 따라 데이터 구조를 분리하고, 업로드된 표 이미지를 기반으로 애니메이션 로직을 수정해 줘.

1. 데이터 파일 분리 (JSON 생성): src/data/ 폴더에 아래 두 파일을 새로 작성해 줘.
2. GameScene 로직 수정: preload()에서 digimon_list.json과 animations.json 두 파일을 모두 로드해 줘.
3. AnimationManager.js 수정 (두 파일 연결)
4. 테스트 연결: Digimon.js에서 기본 디지몬을 'botamon'(210)으로 설정해 줘.
```

## 수정된 파일 목록

1. `src/objects/digimon/StatusManager.js` - Date.now() 기반 시간 로직, eat() 메서드 추가
2. `src/objects/digimon/Digimon.js` - 스프라이트 적용, AnimationManager 통합
3. `src/scenes/GameScene.js` - preload 추가, JSON 로드, 밥 먹기 버튼 추가
4. `src/objects/digimon/AnimationManager.js` - 새로 생성 (애니메이션 관리)
5. `src/data/digimon_list.json` - 새로 생성 (디지몬 정보)
6. `src/data/animations.json` - 새로 생성 (애니메이션 패턴)

## 구현된 기능

### 시간 시스템
- ✅ Date.now() 기반 실제 시간 추적
- ✅ 브라우저 탭 비활성화 시에도 시간 동기화
- ✅ 1초당 배고픔 1 감소

### 스프라이트 시스템
- ✅ 사각형 대신 실제 이미지 사용
- ✅ 기본 디지몬: botamon (210.png)

### 밥 먹기 기능
- ✅ StatusManager.eat() 메서드
- ✅ 화면 하단 밥 먹기 버튼
- ✅ 버튼 클릭 시 배고픔 +10 (최대 100)
- ✅ eat 애니메이션 재생

### 애니메이션 시스템
- ✅ JSON 기반 데이터 구조
- ✅ 프레임 계산 로직
- ✅ 애니메이션 시퀀스 재생

## 다음 단계

- [ ] 다른 애니메이션 테스트 (idle, sleep 등)
- [ ] 애니메이션 속도 조절
- [ ] 다른 디지몬으로 전환 기능
- [ ] 애니메이션 루프 처리 개선

