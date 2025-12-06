# 디지몬 다마고치 게임

HTML5와 Phaser 3를 사용하여 개발되는 현실 시간과 동기화되는 온라인 다마고치 게임입니다.

## 프로젝트 구조

```
d2gemini/
├── index.html          # 게임이 시작되는 웹페이지 (입구)
├── style.css           # 게임 화면 중앙 정렬, 배경색 등 꾸미기
├── package.json        # 프로젝트 정보
├── vercel.json         # Vercel 배포 설정 파일
├── assets/             # 게임 리소스 창고
│   ├── images/         # 디지몬 도트, 배경, 버튼 이미지들
│   └── sounds/         # 배경음악, 효과음
├── src/                # 자바스크립트 코드 - 진짜 핵심
│   ├── main.js         # 게임 초기 설정 및 실행 파일
│   ├── scenes/         # 게임의 장면들 (타이틀화면, 게임화면)
│   │   ├── TitleScene.js
│   │   └── GameScene.js
│   ├── objects/        # 디지몬 객체, UI 객체 등
│   │   └── digimon/    # 디지몬 관련 모듈
│   └── utils/          # 도와주는 도구들
│       └── TimeManager.js # 시간 계산 로직
├── data/               # 데이터 파일
│   └── evolutions.json # 진화 트리 정보
└── docs/               # 문서 폴더
    ├── rules/          # 게임 규칙 및 목표
    ├── logs/           # 개발 일지
    └── todo/           # 할 일 목록
```

## 시작하기

1. 로컬 서버 실행 (ES6 모듈 사용을 위해 필요)
   ```bash
   # Python 3 사용 시
   python -m http.server 8000
   
   # Node.js 사용 시
   npm run dev
   # 또는
   npx http-server -p 8000
   ```

2. 브라우저에서 `http://localhost:8000` 접속

## 기술 스택

- HTML5
- Phaser 3
- JavaScript (ES6 모듈)

## 개발 원칙

- 문서 중심 개발 (Documentation First)
- 모듈화된 코드 구조
- 역할 분리 및 단일 책임 원칙

