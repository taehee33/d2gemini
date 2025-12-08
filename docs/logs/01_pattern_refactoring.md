# 본체-부품 패턴 리팩토링 작업 로그

**작업 일시**: 2025년 12월 7일  
**작업 내용**: 본체(Container)와 부품(Manager) 간의 대화법 패턴 적용

## 수행한 작업

### 1. 데이터 소유권 변경
- **Digimon.js (본체/사장님)**:
  - `this.data` 객체에 모든 상태 데이터 소유
  - StatusManager 생성 시 `this` 전달
  - 본체가 모든 데이터를 관리하는 구조

### 2. StatusManager 리팩토링
- **변경 전**: StatusManager가 자체적으로 `status` 객체 보유
- **변경 후**: `digimon.data`에 직접 접근하여 수치 관리
- constructor에서 `digimon` 객체를 받아 저장
- `digimon.data.hunger` 등으로 직접 접근

### 3. EvolutionManager 일관성 유지
- `digimon.data`에 직접 접근하도록 수정
- `getStatus()` 메서드 대신 직접 접근 방식 사용

## 패턴 설명

### 본체-부품 대화법
```
본체 (Digimon.js): "나는 사장이야. 너희들(매니저)을 채용할 때, 내 명함(this)을 줄게."
부품 (StatusManager.js): "사장님 명함을 받았으니, 사장님의 데이터를 직접 고칠게."
```

### 코드 구조
```javascript
// Digimon.js (본체)
this.data = { hunger: 100, ... };
this.statusManager = new StatusManager(this); // this 전달

// StatusManager.js (부품)
constructor(digimon) {
    this.digimon = digimon; // 사장님 기억
}
update() {
    this.digimon.data.hunger -= 5; // 직접 접근
}
```

## 수정된 파일 목록

1. `src/objects/digimon/Digimon.js` - 데이터 소유권 및 구조 변경
2. `src/objects/digimon/StatusManager.js` - 직접 접근 방식으로 변경
3. `src/objects/digimon/EvolutionManager.js` - 직접 접근 방식으로 변경

## 장점

- 데이터 소유권이 명확함 (본체가 소유)
- Manager 간 데이터 공유가 쉬움
- 코드 가독성 향상
- 유지보수 용이

