# Contest Compass 🧭

> SGIS 통계 데이터와 AI를 결합하여 창업자에게 최적화된 공모전을 추천하는 혁신적 웹 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma)](https://www.prisma.io/)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet%204.0-orange)](https://docs.anthropic.com/)
[![SGIS API](https://img.shields.io/badge/SGIS-OpenAPI-green)](https://sgis.kostat.go.kr/)

## 🎯 프로젝트 개요

Contest Compass는 창업자들이 수많은 공모전 중에서 자신에게 가장 적합한 기회를 찾을 수 있도록 돕는 AI 기반 매칭 플랫폼입니다. 통계청의 SGIS 데이터와 Claude Sonnet 4.0 AI를 활용하여 개인화된 공모전 추천을 제공합니다.

### 🌟 주요 특징

- **🤖 AI 기반 분석**: Claude Sonnet 4.0을 활용한 아이디어 분석 및 키워드 추출
- **📊 실시간 데이터**: SGIS OpenAPI를 통한 지역별 인구/사업체 통계 분석
- **🎯 맞춤형 추천**: 사용자 프로필과 지역 데이터 기반 정확한 매칭
- **📱 반응형 UI**: 모든 디바이스에서 최적화된 사용자 경험
- **⚡ 빠른 분석**: 3분 이내 완료되는 신속한 분석 프로세스

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI 패턴

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **AI**: Claude Sonnet 4.0 API
- **Data Source**: SGIS OpenAPI

### Deployment
- **Hosting**: Vercel
- **Environment**: Node.js 18+

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/contest-compass.git
cd contest-compass
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.example`를 `.env.local`로 복사하고 필요한 API 키를 입력하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음 정보를 입력:
```env
# SGIS OpenAPI 인증 정보
SGIS_SERVICE_ID=your_sgis_service_id
SGIS_SECURITY_KEY=your_sgis_security_key

# Claude API 인증키
ANTHROPIC_API_KEY=your_claude_api_key

# 데이터베이스
DATABASE_URL="file:./dev.db"
```

### 4. 데이터베이스 설정
```bash
# Prisma 마이그레이션
npx prisma db push

# 시드 데이터 생성
npx tsx prisma/seed.ts
```

### 5. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 앱을 확인할 수 있습니다.

## 📋 API 키 발급 방법

### SGIS OpenAPI 키 발급
1. [SGIS 개발자 사이트](https://sgis.kostat.go.kr/developer/) 접속
2. 회원가입 및 로그인
3. 서비스 신청 → OpenAPI 신청
4. Service ID와 Security Key 발급받기

### Claude API 키 발급
1. [Anthropic Console](https://console.anthropic.com/) 접속
2. 계정 생성 및 결제 정보 등록
3. API Keys 메뉴에서 새 키 생성
4. 생성된 키 복사

## 🎨 주요 기능

### 1. 홈페이지 (/)
- 서비스 소개 및 주요 기능 안내
- 시작하기 버튼으로 분석 페이지 이동

### 2. 분석 페이지 (/analysis)
- 사용자 입력 폼 (사업분야, 팀규모, 아이디어 등)
- AI 기반 실시간 분석
- 맞춤형 공모전 추천 결과

### 3. 공모전 목록 (/contests)
- 전체 공모전 목록 조회
- 카테고리별 필터링
- 마감일 기준 정렬

### 4. 소개 페이지 (/about)
- 서비스 상세 설명
- 기술 스택 및 개발 정보

### 5. 분석 API (/api/analyze)
- 사용자 입력 데이터 처리
- Claude AI를 통한 키워드 추출
- SGIS 데이터와의 매칭 점수 계산
- 추천 결과 반환

## 📊 데이터 구조

### Contest (공모전)
```typescript
interface Contest {
  id: string;
  title: string;
  organizer: string;
  category: string;
  maxAmount?: number | null;
  supportPeriod?: number | null;
  region?: string | null;
  targetAudience: string;
  deadline?: Date | null;
  url?: string | null;
  isActive: boolean;
}
```

### Analysis (분석결과)
```typescript
interface Analysis {
  id: string;
  userId: string;
  businessType: string;
  teamSize: string;
  targetRegion?: string;
  ideaDescription: string;
  recommendations: string; // JSON
}
```

## 🔧 배포 방법

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정:
- `SGIS_SERVICE_ID`
- `SGIS_SECURITY_KEY`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

## 🧪 테스트

### 빌드 테스트
```bash
npm run build
```

### 린트 검사
```bash
npm run lint
```

### 타입 체크
```bash
npx tsc --noEmit
```

## 📁 프로젝트 구조

```
contest-compass/
├── src/
│   ├── app/                 # Next.js App Router 페이지
│   │   ├── analysis/        # 분석 페이지
│   │   ├── api/             # API 라우트
│   │   ├── contests/        # 공모전 목록 페이지
│   │   └── about/           # 소개 페이지
│   ├── components/          # React 컴포넌트
│   │   ├── forms/           # 폼 컴포넌트
│   │   └── ui/              # UI 컴포넌트
│   ├── lib/                 # 라이브러리 및 유틸리티
│   │   ├── prisma.ts        # Prisma 클라이언트
│   │   ├── claude-analyzer.ts # Claude AI 분석
│   │   └── sgis-client.ts   # SGIS API 클라이언트
│   └── types/               # TypeScript 타입 정의
├── prisma/                  # 데이터베이스 스키마 및 시드
├── public/                  # 정적 파일
└── 설정 파일들
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의사항

- **개발자**: 박용환
- **이메일**: your-email@example.com
- **프로젝트 링크**: [https://github.com/your-username/contest-compass](https://github.com/your-username/contest-compass)

## 🙏 감사의 말

- [통계청 SGIS](https://sgis.kostat.go.kr/) - 지역 통계 데이터 제공
- [Anthropic](https://anthropic.com/) - Claude AI API 제공
- [Next.js](https://nextjs.org/) - 뛰어난 React 프레임워크
- [Vercel](https://vercel.com/) - 간편한 배포 플랫폼

---

**Contest Compass**와 함께 당신만을 위한 최적의 창업 기회를 발견하세요! 🚀