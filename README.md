# SeeNear - 이웃과 함께하는 따뜻한 돌봄 서비스

<div align="center">

![SeeNear Logo](public/icon.svg)

**선생님들의 경험과 이웃의 필요를 연결하는 AI 기반 돌봄 매칭 플랫폼**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://see-near-mvp-deploy.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[🌐 Live Demo](https://see-near-mvp-deploy.vercel.app) | [📖 Demo Guide](DEMO_GUIDE.md)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 페이지](#-주요-페이지)
- [배포](#-배포)
- [개발자](#-개발자)

---

## 🎯 프로젝트 소개

**SeeNear**는 시니어 세대의 경험과 이웃의 필요를 연결하는 AI 기반 돌봄 매칭 플랫폼입니다.

### 핵심 가치
- 🧡 **따뜻한 연결**: 가까운 이웃 간의 신뢰 기반 매칭
- 🎯 **AI 매칭**: 위치, 경력, 선호도 기반 최적 매칭
- 💼 **일자리 창출**: 시니어를 위한 의미 있는 일자리 제공
- 📱 **간편한 사용**: 음성 인식 기반 직관적인 UI/UX

---

## ✨ 주요 기능

### 1. 선생님 온보딩 (`/senior`)
- ✅ 체크리스트 기반 프로필 작성
- 🎤 음성 녹음으로 경력 소개
- 🤖 AI 자동 요약 생성
- 📍 위치 기반 서비스 지역 설정

### 2. 요청자 매칭 (`/demander`)
- 📝 퀵 선택 템플릿 (가정 지원, 환경 관리, 사업 보조)
- 🗺️ 지도 기반 후보자 검색
- 👥 후보자 프로필 확인 (배지, 경력, 거리)
- 📞 실시간 매칭 및 전화 연결

### 3. 일자리 찾기 (`/jobs`)
- 🔍 카테고리별 일자리 필터링
- 📍 거리 기반 정렬
- 💰 시급 및 근무 시간 표시
- 📞 지원 시 자동 전화 연결 시뮬레이션

### 4. AI 매칭 시스템 (`/matching`)
- 🔄 실시간 매칭 프로세스 시각화
- 📊 위치, 경력, 선호도 기반 분석
- ✅ 최적 후보자 자동 선정
- 🎉 매칭 성공 알림

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Lucide React Icons
- **State Management**: Zustand

### Maps & Location
- **Map Library**: Leaflet + React Leaflet
- **Geocoding**: OpenStreetMap Nominatim API

### AI & Voice
- **Voice Recording**: MediaRecorder API
- **Text-to-Speech**: Web Speech API
- **AI Summary**: (Mock implementation for MVP)

### Deployment
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions (auto-deploy on push to main)

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/howl-papa/SeeNear-MVP-Deploy.git
cd seenear

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

---

## 📁 프로젝트 구조

```
seenear/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── page.tsx           # 홈 페이지
│   │   ├── senior/            # 선생님 온보딩
│   │   ├── demander/          # 요청자 매칭
│   │   ├── jobs/              # 일자리 찾기
│   │   ├── matching/          # AI 매칭 프로세스
│   │   ├── layout.tsx         # 전역 레이아웃 (SEO, 메타데이터)
│   │   └── globals.css        # 전역 스타일
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   └── voice-recorder.tsx # 음성 녹음 컴포넌트
│   ├── hooks/                 # Custom React Hooks
│   │   └── use-voice-recorder.ts
│   └── lib/                   # 유틸리티 및 상태 관리
│       ├── store.ts           # Zustand 스토어
│       └── utils.ts           # 헬퍼 함수
├── public/                    # 정적 파일
│   └── icon.svg              # 브랜드 아이콘
├── DEMO_GUIDE.md             # 데모 가이드
└── README.md                 # 이 파일
```

---

## 📱 주요 페이지

### 홈 (`/`)
- 브랜드 소개 및 역할 선택 (선생님 / 요청자)
- 반응형 디자인 (모바일 최적화)

### 선생님 온보딩 (`/senior`)
1. 체크리스트 작성 (시력, 체력, 경험 등)
2. 음성으로 경력 소개 녹음
3. AI 자동 요약 생성
4. 프로필 저장 및 일자리 탐색

### 요청자 페이지 (`/demander`)
1. 퀵 선택으로 요청서 작성
2. 지도에서 후보자 위치 확인
3. 후보자 카드 클릭하여 프로필 확인
4. 매칭 요청 및 전화 연결

### 일자리 찾기 (`/jobs`)
1. 카테고리 필터 (전체, 가정 지원, 환경 관리, 사업 보조)
2. 일자리 카드 (위치, 시간, 시급 표시)
3. 지원하기 클릭 시 전화 수락 화면
4. 수락 시 일자리 확정

### AI 매칭 (`/matching`)
1. 실시간 매칭 로그 표시
2. 위치 기반 후보자 분석
3. 최적 후보 선정 애니메이션
4. 전화 연결 시뮬레이션

---

## 🌐 배포

### Vercel 자동 배포
- **Production URL**: https://see-near-mvp-deploy.vercel.app
- **자동 배포**: `main` 브랜치에 push 시 자동 배포
- **빌드 시간**: 약 8초

### 환경 변수
현재 MVP는 환경 변수가 필요하지 않습니다. (모든 API가 Mock 또는 Public)

---

## 🎨 디자인 특징

### 브랜딩
- **Primary Color**: Orange (#f97316) - 따뜻함과 활력
- **Typography**: Geist Sans (Next.js 기본 폰트)
- **Icons**: Lucide React (일관된 아이콘 스타일)

### UX 원칙
- **모바일 우선**: 시니어 사용자를 위한 큰 버튼과 명확한 레이아웃
- **음성 중심**: 텍스트 입력 최소화, 음성 녹음 활용
- **시각적 피드백**: 애니메이션과 상태 표시로 명확한 피드백
- **자연스러운 언어**: 사람이 작성한 것 같은 따뜻한 문구

---

## 🔧 개발 가이드

### 코드 스타일
- **ESLint**: Next.js 권장 설정
- **TypeScript**: Strict mode
- **Formatting**: Prettier (자동 포맷팅)

### 주요 라이브러리
```json
{
  "next": "16.1.6",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4.0.0",
  "zustand": "^5.0.2",
  "leaflet": "^1.9.4",
  "lucide-react": "^0.468.0"
}
```

---

## 👨‍💻 개발자

**Yongrak Park**
- GitHub: [@howl-papa](https://github.com/howl-papa)
- Email: yongrak.pro@gmail.com

---

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

---

## 🙏 감사의 말

SeeNear MVP를 방문해 주셔서 감사합니다. 이웃과 함께하는 따뜻한 돌봄 서비스를 만들어가겠습니다.

**Made with 🧡 by Yongrak Park**
