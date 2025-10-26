# Gemini 프로젝트 가이드라인

이 문서는 해당 프로젝트의 기술 스택, 코딩 컨벤션, 아키텍처 패턴을 설명합니다. 앞으로 Gemini AI 어시스턴트가 프로젝트를 수정할 때 이 가이드라인을 참고합니다.

## 1. 핵심 기술

### 프론트엔드 (Frontend)
- **프레임워크:** React (Vite 기반)
- **언어:** JavaScript (ES6+) with JSX
- **스타일링:** Tailwind CSS
- **라우팅:** `react-router-dom`
- **패키지 매니저:** npm

### 백엔드 (Backend)
- **프레임워크:** Node.js with Express
- **언어:** JavaScript (CommonJS)
- **패키지 매니저:** npm

### API
- **AI 서비스:** OpenAI (ChatGPT) API를 사용합니다. 모든 API 호출은 보안을 위해 자체 백엔드 서버를 통해 중계됩니다.

## 2. 아키텍처

- **프론트엔드 상태 관리:** 상태는 "상태 끌어올리기(lifting state up)" 패턴을 통해 가장 가까운 공통 조상 컴포넌트(주로 `App.jsx`)에서 관리합니다. Redux나 Zustand 같은 별도의 상태 관리 라이브러리는 현재 사용하지 않습니다.
- **백엔드 아키텍처:** 간단한 Express 서버가 BFF(Backend-for-Frontend) 역할을 합니다. 주된 역할은 OpenAI 같은 외부 서비스로의 API 호출을 안전하게 중계하는 것입니다.
- **환경 변수:**
    - **프론트엔드 (`your-project/src/.env`):** 비밀 키를 절대 저장하지 않습니다.
    - **백엔드 (`your-project/backend/.env`):** `OPENAI_API_KEY` 같은 모든 비밀 키는 여기에 저장하고 `dotenv` 패키지를 통해 불러옵니다.

## 3. 코딩 스타일 및 규칙

- **일반:** 최신 JavaScript(ES6+) 및 React 모범 사례를 따릅니다.
- **컴포넌트:** Hooks (`useState`, `useEffect` 등)를 사용하는 함수형 컴포넌트를 사용합니다.
- **포맷팅:** 일관되고 가독성 있는 코드 스타일을 유지합니다. (Prettier와 유사한 스타일)
- **파일 이름:** 컴포넌트는 파스칼케이스(PascalCase)를 사용합니다. (예: `RecipeBook.jsx`)
- **주석:** 복잡한 로직의 '무엇'보다는 '왜'에 초점을 맞춰 주석을 추가합니다.

## 4. 프로젝트 구조

```
your-project/
├── .git/
├── backend/         # Node.js 백엔드 서버
│   ├── .env         # 백엔드 환경 변수 (API 키)
│   ├── .gitignore
│   ├── server.js    # Express 서버 로직
│   └── ...
├── src/             # React 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── pages/   # 라우트 컴포넌트
│   │   ├── App.jsx      # 메인 컴포넌트, 상태 관리
│   │   └── ...
│   ├── .env         # 프론트엔드 환경 변수 (비밀이 아닌 값)
│   └── ...
├── DEVELOPMENT_LOG.md
├── GEMINI.md        # 본 파일
└── README.md
```
