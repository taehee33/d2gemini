# StatusManager 구현 및 UI 표시 작업 로그

**작업 일시**: 2025년 12월 7일  
**작업 내용**: StatusManager에 Phaser.Time.TimerEvent 적용 및 Digimon Container에 배고픔 텍스트 추가

## 수행한 작업

### 1. StatusManager 구현 개선
- **파일**: `src/objects/digimon/StatusManager.js`
- **변경 사항**:
  - 기존 delta 기반 타이머를 `Phaser.Time.TimerEvent`로 변경
  - `scene.time.addEvent()`를 사용하여 1초마다 배고픔 5씩 감소
  - 배고픔이 0이 되면 `console.warn()`으로 경고 로그 출력
  - `destroy()` 메서드 추가하여 타이머 정리 기능 구현

### 2. Digimon Container에 텍스트 객체 추가
- **파일**: `src/objects/digimon/Digimon.js`
- **변경 사항**:
  - `hungerText` 텍스트 객체를 Container 내부에 추가
  - 디지몬 스프라이트 위쪽(-80px)에 배치
  - `update()` 메서드에서 배고픔 수치를 실시간으로 갱신
  - 배고픔 수치에 따라 텍스트 색상 변경:
    - 50 이상: 초록색 (#00ff00)
    - 20~50: 노란색 (#ffff00)
    - 20 미만: 빨간색 (#ff0000)

### 3. GameScene 정리
- **파일**: `src/scenes/GameScene.js`
- **변경 사항**:
  - 배고픔 텍스트 관리 로직을 Digimon Container로 이동
  - 씬은 디지몬 객체만 관리하도록 단순화

## 사용한 프롬프트

```
"이제 .cursorrules에 따라 다음 작업을 진행하자.

1. StatusManager 구현:
src/objects/digimon/StatusManager.js에 1초마다 배고픔(hunger) 수치를 5씩 감소시키는 타이머 로직을 추가해줘. (Phaser.Time.TimerEvent 사용)

배고픔이 0이 되면 콘솔에 경고 로그를 출력해줘.

2. 화면 표시 (UI):
src/objects/digimon/Digimon.js (Container)에 텍스트 객체를 하나 추가해줘.

update 함수에서 StatusManager의 현재 배고픔 수치를 가져와서 텍스트 내용을 실시간으로 갱신해줘. (예: '배고픔: 85')
```

## 구현된 로직

### Phaser.Time.TimerEvent 사용
```javascript
this.hungerTimer = this.scene.time.addEvent({
    delay: 1000, // 1초마다
    callback: this.decreaseHunger,
    callbackScope: this,
    loop: true // 반복 실행
});
```

### 배고픔 감소 로직
- 1초마다 자동으로 `decreaseHunger()` 콜백 실행
- 배고픔 수치를 5씩 감소 (최소값 0)
- 배고픔이 0이 되면 경고 메시지 출력

### 실시간 UI 업데이트
- 매 프레임마다 `update()` 메서드에서 텍스트 내용 갱신
- 배고픔 수치에 따라 색상 자동 변경

## 수정된 파일 목록

1. `src/objects/digimon/StatusManager.js` - Phaser.Time.TimerEvent 적용
2. `src/objects/digimon/Digimon.js` - 텍스트 객체 추가 및 업데이트 로직
3. `src/scenes/GameScene.js` - 텍스트 관리 로직 제거 (단순화)

## 다음 단계

- [ ] 배고픔 회복 기능 (밥 먹기)
- [ ] 다른 상태 수치 UI 표시 (근력, 행복도 등)
- [ ] 상태 수치에 따른 디지몬 행동 변화

