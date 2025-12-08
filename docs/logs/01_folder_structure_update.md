# 폴더 구조 업데이트 작업 로그

**작업 일시**: 2025년 12월 7일  
**작업 내용**: 프로젝트 폴더 구조를 확장된 구조로 업데이트

## 수행한 작업

### 1. 새 폴더 및 파일 생성
- `style.css`: 게임 화면 스타일링 (중앙 정렬, 배경색)
- `package.json`: 프로젝트 정보 및 스크립트
- `vercel.json`: Vercel 배포 설정
- `assets/images/`: 이미지 리소스 폴더
- `assets/sounds/`: 사운드 리소스 폴더
- `src/scenes/`: 게임 씬 폴더
  - `TitleScene.js`: 타이틀 화면
  - `GameScene.js`: 게임 메인 화면
- `src/utils/`: 유틸리티 폴더
  - `TimeManager.js`: 시간 계산 로직
- `data/`: 데이터 파일 폴더
  - `evolutions.json`: 진화 트리 정보

### 2. 씬 시스템 도입
- 타이틀 화면과 게임 화면을 분리
- `src/main.js`를 씬 기반 구조로 변경

### 3. 리소스 관리 구조화
- 이미지와 사운드를 별도 폴더로 분리
- 향후 리소스 추가를 위한 구조 준비

## 생성된 파일 구조

```
d2gemini/
├── index.html
├── style.css
├── package.json
├── vercel.json
├── assets/
│   ├── images/
│   └── sounds/
├── src/
│   ├── main.js
│   ├── scenes/
│   │   ├── TitleScene.js
│   │   └── GameScene.js
│   ├── objects/
│   │   └── digimon/
│   └── utils/
│       └── TimeManager.js
├── data/
│   └── evolutions.json
└── docs/
```

## 다음 단계

- [ ] 실제 이미지 및 사운드 리소스 추가
- [ ] TimeManager 활용한 시간 동기화 구현

