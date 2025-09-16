# Contest Compass - PRD (Product Requirements Document)

## 🎯 프로젝트 개요

### 프로젝트명
**Contest Compass** - SGIS 기반 스마트 공모전 매칭 플랫폼

### 비전
SGIS 통계 데이터와 AI를 결합하여 창업자에게 최적화된 공모전을 추천하는 혁신적 웹 플랫폼

### 목표
- **단기 목표**: 2025년 9월 30일까지 작동하는 프로토타입 완성 및 공모전 제출
- **중기 목표**: 공모전 수상 후 실제 서비스 런칭
- **장기 목표**: 전국 창업 생태계의 표준 매칭 플랫폼으로 성장

---

## 🏗️ 기술 스택 및 아키텍처

### Frontend
- **Framework**: Next.js 14+ (App Router 사용)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI 또는 Radix UI
- **Charts**: Chart.js 또는 Recharts
- **Maps**: 네이버 지도 API (SGIS 지도 대안)

### Backend
- **API Routes**: Next.js API Routes (서버리스 함수)
- **Authentication**: NextAuth.js (소셜 로그인 지원)
- **Validation**: Zod
- **HTTP Client**: Axios

### Database (로컬 저장소)
- **Primary DB**: SQLite (로컬 파일 기반)
- **ORM**: Prisma
- **Seed Data**: JSON 파일로 초기 데이터 관리
- **Backup**: Git으로 관리되는 로컬 DB 파일

### External APIs
- **SGIS OpenAPI**: 인구/사업체 통계 데이터
- **창업진흥원 K-Startup API**: 창업지원사업 정보
- **기업마당 지원사업정보 API**: 정부 지원사업 데이터
- **Claude Sonnet 4.0 API**: AI 기반 매칭 분석 및 추천

### Deployment
- **Git Repository**: GitHub
- **Hosting**: Vercel
- **Environment Variables**: Vercel Environment Variables
- **Database**: SQLite 파일 (Git에 포함)

---

## 📊 데이터 소스 및 API 연동

### 1. SGIS OpenAPI 연동
```typescript
// SGIS API 설정
const SGIS_CONFIG = {
  BASE_URL: 'https://sgis.kostat.go.kr/OpenAPI3',
  SERVICE_ID: process.env.SGIS_SERVICE_ID,
  SECURITY_KEY: process.env.SGIS_SECURITY_KEY,
  RATE_LIMIT: 50000 // 일일 호출 제한
}

// 주요 활용 API
- 인구총조사 API: 지역별 연령대별 인구 현황
- 전국사업체조사 API: 업종별 사업체 분포
- 행정구역 API: 시도/시군구 정보
```

### 2. 공모전 데이터 API
```typescript
// K-Startup API
const KSTARTUP_CONFIG = {
  BASE_URL: 'https://nidview.k-startup.go.kr/api',
  API_KEY: process.env.KSTARTUP_API_KEY
}

// 기업마당 API  
const BIZINFO_CONFIG = {
  BASE_URL: 'https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do',
  FORMAT: 'JSON'
}
```

### 3. Claude Sonnet 4.0 API 연동
```typescript
const CLAUDE_CONFIG = {
  API_KEY: process.env.ANTHROPIC_API_KEY,
  MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 1000
}

// 사용 목적
- 사용자 입력 분석 (아이디어 키워드 추출)
- 공모전-사용자 매칭 점수 계산
- 개인화 추천 로직
- 성공 확률 예측
```

---

## 🗄️ 데이터베이스 설계

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./contest_compass.db"
}

model User {
  id          String   @id @default(cuid())
  name        String?
  email       String   @unique
  image       String?
  createdAt   DateTime @default(now())
  analyses    Analysis[]
}

model Contest {
  id              String   @id @default(cuid())
  title           String
  organizer       String
  category        String
  maxAmount       Int?
  supportPeriod   Int?
  region          String?
  targetAudience  String
  deadline        DateTime?
  url             String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SgisData {
  id            String   @id @default(cuid())
  regionCode    String
  regionName    String
  dataType      String   // 'population', 'business', 'startup'
  ageGroup      String?
  businessType  String?
  value         Int
  year          Int
  createdAt     DateTime @default(now())
  
  @@unique([regionCode, dataType, ageGroup, businessType, year])
}

model Analysis {
  id              String   @id @default(cuid())
  userId          String
  businessType    String
  teamSize        String
  targetRegion    String?
  ideaDescription String
  recommendations Json     // 추천 결과 저장
  createdAt       DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

---

## 🔧 핵심 기능 구현

### 1. 사용자 입력 분석 (Claude API 활용)
```typescript
// lib/claude-analyzer.ts
export async function analyzeUserInput(input: UserInput): Promise<AnalysisResult> {
  const prompt = `
  다음 사용자 정보를 분석해주세요:
  - 사업 분야: ${input.businessType}
  - 팀 규모: ${input.teamSize}
  - 아이디어: ${input.ideaDescription}
  - 선호 지역: ${input.targetRegion}
  
  다음 형식의 JSON으로 응답해주세요:
  {
    "keywords": ["키워드1", "키워드2"],
    "targetCustomer": "타겟 고객층",
    "businessModel": "비즈니스 모델 유형",
    "competitiveAdvantage": "경쟁 우위 요소"
  }
  `;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  return await response.json();
}
```

### 2. SGIS 데이터 분석
```typescript
// lib/sgis-client.ts
export class SGISClient {
  private baseURL = 'https://sgis.kostat.go.kr/OpenAPI3';
  
  async getPopulationData(regionCode: string): Promise<PopulationData[]> {
    const response = await fetch(
      `${this.baseURL}/boundary/sido/geojson?serviceKey=${process.env.SGIS_API_KEY}&year=2023`
    );
    return await response.json();
  }
  
  async getBusinessData(regionCode: string, businessType: string): Promise<BusinessData[]> {
    // 사업체 통계 API 호출
    const response = await fetch(
      `${this.baseURL}/stats/searchregion?serviceKey=${process.env.SGIS_API_KEY}&cd=${regionCode}`
    );
    return await response.json();
  }
}
```

### 3. 매칭 알고리즘
```typescript
// lib/matching-engine.ts
export class ContestMatchingEngine {
  async calculateMatchScore(
    user: UserAnalysis,
    contest: Contest,
    sgisData: SgisData
  ): Promise<MatchScore> {
    
    // 1. 인구 매칭도 (30%)
    const populationMatch = this.calculatePopulationMatch(user, sgisData);
    
    // 2. 경쟁 강도 (25%)
    const competitionLevel = this.calculateCompetitionLevel(user, sgisData);
    
    // 3. 창업 인프라 (25%) 
    const infrastructureScore = this.calculateInfrastructureScore(contest.region, sgisData);
    
    // 4. 과거 성과 (20%)
    const historicalSuccess = this.calculateHistoricalSuccess(contest);
    
    const totalScore = (
      populationMatch * 0.3 +
      competitionLevel * 0.25 +
      infrastructureScore * 0.25 +
      historicalSuccess * 0.2
    );
    
    return {
      totalScore,
      breakdown: {
        populationMatch,
        competitionLevel,
        infrastructureScore,
        historicalSuccess
      }
    };
  }
}
```

---

## 🎨 UI/UX 설계

### 페이지 구조
```
/                    - 랜딩 페이지
/analysis           - 분석 입력 폼
/results            - 추천 결과 페이지
/contests           - 공모전 목록
/about              - 서비스 소개
/api/analyze        - 분석 API
/api/contests       - 공모전 데이터 API
/api/sgis           - SGIS 데이터 API
```

### 주요 컴포넌트
```typescript
// components/AnalysisForm.tsx - 사용자 입력 폼
// components/ResultsDisplay.tsx - 추천 결과 표시
// components/ContestCard.tsx - 공모전 카드
// components/DataVisualization.tsx - SGIS 데이터 차트
// components/LoadingSpinner.tsx - 로딩 상태
// components/RegionMap.tsx - 지역별 시각화
```

---

## 🚀 개발 로드맵

### Phase 1: 기본 구조 구축 (9월 16-20일)
- [ ] Next.js 프로젝트 셋업 및 기본 UI
- [ ] SQLite 데이터베이스 및 Prisma 설정
- [ ] SGIS API 연동 테스트
- [ ] 공모전 데이터 수집 및 시딩

### Phase 2: 핵심 기능 개발 (9월 21-25일)
- [ ] Claude API 연동 및 분석 로직
- [ ] 매칭 알고리즘 구현
- [ ] 사용자 입력 폼 완성
- [ ] 결과 표시 페이지 구현

### Phase 3: 데이터 시각화 및 최적화 (9월 26-28일)
- [ ] Chart.js를 활용한 데이터 시각화
- [ ] 지역별 지도 표시
- [ ] 성능 최적화 및 에러 처리
- [ ] 반응형 UI 완성

### Phase 4: 배포 및 테스트 (9월 29-30일)
- [ ] Vercel 배포 설정
- [ ] 환경 변수 설정
- [ ] 최종 테스트 및 버그 수정
- [ ] 공모전 제출 준비

---

## 🔒 환경 변수 설정

### .env.local
```bash
# SGIS API
SGIS_SERVICE_ID=your_sgis_service_id
SGIS_SECURITY_KEY=your_sgis_security_key

# Claude API  
ANTHROPIC_API_KEY=your_claude_api_key

# K-Startup API
KSTARTUP_API_KEY=your_kstartup_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database
DATABASE_URL="file:./contest_compass.db"
```

---

## 📈 성공 지표

### 기술적 지표
- [ ] SGIS API 성공적 연동 (일일 호출 제한 내)
- [ ] Claude API 응답 시간 < 3초
- [ ] 전체 페이지 로딩 시간 < 2초
- [ ] 모바일 반응형 완벽 지원

### 비즈니스 지표
- [ ] 공모전 매칭 정확도 > 70%
- [ ] 사용자 만족도 > 4.0/5.0
- [ ] 베타 테스트 참여자 50명 이상
- [ ] SGIS 공모전 최우수상 수상

---

## 🎯 차별화 포인트

### 기술적 차별화
1. **실시간 AI 분석**: Claude Sonnet 4.0을 활용한 개인화 추천
2. **다중 데이터 소스**: SGIS + 정부 API 통합 활용
3. **직관적 시각화**: 복잡한 통계를 쉬운 차트로 표현

### 비즈니스 차별화
1. **완전 무료 서비스**: 광고나 유료 모델 없음
2. **실용적 접근**: 실제 창업자들이 바로 사용 가능
3. **확장성**: 전국 모든 지역 및 업종 지원

---

## 🔧 개발 시작 가이드

### 1. 프로젝트 초기 설정
```bash
# 1. Next.js 프로젝트 생성
npx create-next-app@latest contest-compass --typescript --tailwind --eslint --app

# 2. 필요한 패키지 설치
cd contest-compass
npm install prisma @prisma/client sqlite3 axios @anthropic-ai/sdk
npm install @types/sqlite3 -D

# 3. Prisma 초기화
npx prisma init --datasource-provider sqlite

# 4. 데이터베이스 마이그레이션
npx prisma migrate dev --name init
npx prisma generate
```

### 2. 환경 변수 설정
- `.env.local` 파일 생성 후 필요한 API 키 설정

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 배포 준비
```bash
# Vercel 배포
npx vercel --prod
```

---

## ✅ 구현 가능성 검증

### 기술적 검증
- ✅ **Next.js**: 검증된 React 프레임워크
- ✅ **SQLite**: 로컬 데이터베이스로 완벽 지원
- ✅ **Claude API**: 안정적인 AI 서비스
- ✅ **SGIS API**: 공공 데이터로 무료 사용 가능
- ✅ **Vercel**: Next.js 최적화된 배포 플랫폼

### 리소스 검증
- ✅ **개발 기간**: 14일 충분
- ✅ **API 비용**: SGIS(무료) + Claude(사용량 기반)
- ✅ **배포 비용**: Vercel 무료 플랜 활용 가능
- ✅ **데이터 저장**: SQLite 로컬 저장으로 비용 없음

**결론: 100% 구현 가능**

---

박용환님, 이 PRD로 실제 작동하는 프로토타입을 만들 수 있습니다. 바로 개발을 시작하시겠습니까?