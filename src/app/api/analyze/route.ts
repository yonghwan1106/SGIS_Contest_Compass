import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { claudeAnalyzer } from '@/lib/claude-analyzer';
import { sgisClient } from '@/lib/sgis-client';
import { UserInput, ContestRecommendation, MatchScore } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const userInput: UserInput = await request.json();

    // 입력 데이터 검증
    if (!userInput.businessType || !userInput.teamSize || !userInput.ideaDescription) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 1. Claude AI로 사용자 입력 분석
    console.log('Analyzing user input with Claude...');
    const analysisResult = await claudeAnalyzer.analyzeUserInput(userInput);

    // 2. 데이터베이스에서 활성 공모전 가져오기
    console.log('Fetching contests from database...');
    let contests;

    try {
      contests = await prisma.contest.findMany({
        where: {
          isActive: true,
          OR: [
            {
              deadline: {
                gt: new Date(), // 마감일이 지나지 않은 것
              },
            },
            {
              deadline: null, // 마감일이 설정되지 않은 것
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.warn('Database not available, using fallback data:', error);
      // Vercel에서 SQLite를 사용할 수 없는 경우 하드코딩된 데이터 사용
      contests = [
        {
          id: 'contest-1',
          title: '2025 K-Global Startup 창업경진대회',
          organizer: 'K-Startup (창업진흥원)',
          category: 'IT/소프트웨어',
          maxAmount: 10000,
          supportPeriod: 12,
          region: '전국',
          targetAudience: '초기창업팀, 예비창업자',
          deadline: new Date('2026-03-31'),
          url: 'https://k-startup.go.kr',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'contest-2',
          title: '혁신창업 리그 2025',
          organizer: '중소벤처기업부',
          category: '제조업',
          maxAmount: 5000,
          supportPeriod: 6,
          region: '대구광역시',
          targetAudience: '제조 스타트업',
          deadline: new Date('2026-02-28'),
          url: 'https://mss.go.kr',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'contest-3',
          title: '바이오헬스 창업챌린지',
          organizer: '한국바이오협회',
          category: '바이오/의료',
          maxAmount: 8000,
          supportPeriod: 18,
          region: '경기도',
          targetAudience: '바이오 분야 창업팀',
          deadline: new Date('2025-04-15'),
          url: 'https://bio.org',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'contest-4',
          title: 'ESG 사회혁신 창업경진대회',
          organizer: '사회혁신기업육성재단',
          category: '환경/에너지',
          maxAmount: 3000,
          supportPeriod: 12,
          region: '서울특별시',
          targetAudience: '사회적 기업, 소셜벤처',
          deadline: new Date('2025-06-15'),
          url: 'https://socialventure.or.kr',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'contest-5',
          title: '에듀테크 혁신 챌린지',
          organizer: '교육부',
          category: '교육',
          maxAmount: 4000,
          supportPeriod: 12,
          region: '세종특별자치시',
          targetAudience: '교육 혁신 스타트업',
          deadline: new Date('2025-05-20'),
          url: 'https://moe.go.kr',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'contest-6',
          title: '핀테크 혁신 아이디어 경진대회',
          organizer: '금융위원회',
          category: '금융/핀테크',
          maxAmount: 15000,
          supportPeriod: 24,
          region: '서울특별시',
          targetAudience: '핀테크 스타트업',
          deadline: new Date('2025-08-28'),
          url: 'https://fsc.go.kr',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'contest-7',
          title: '청년창업 아이디어 경진대회',
          organizer: '고용노동부',
          category: '유통/서비스',
          maxAmount: 3500,
          supportPeriod: 12,
          region: '광주광역시',
          targetAudience: '청년 예비창업자',
          deadline: new Date('2025-07-25'),
          url: 'https://moel.go.kr',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }

    console.log(`Found ${contests.length} active contests`);

    if (contests.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: '현재 진행 중인 공모전이 없습니다.',
      });
    }

    // 3. SGIS 지역 데이터 가져오기 (선택된 지역이 있는 경우)
    let regionData = null;
    if (userInput.targetRegion) {
      console.log(`Fetching SGIS data for region: ${userInput.targetRegion}`);
      try {
        // SGIS API를 통해 실제 지역 데이터 가져오기
        regionData = await sgisClient.getPopulationData(userInput.targetRegion);
        if (regionData) {
          console.log(`SGIS data loaded for ${regionData.regionName}: ${regionData.totalPopulation} people`);
        }
      } catch (error) {
        console.warn('SGIS data fetch failed, continuing without region data:', error);
      }
    }

    // 4. 각 공모전에 대해 매칭 점수 계산
    console.log('Calculating match scores...');
    const recommendations: ContestRecommendation[] = await Promise.all(
      contests.map(async (contest) => {
        // 매칭 점수 계산
        const contestDescription = `
          제목: ${contest.title}
          주최기관: ${contest.organizer}
          분야: ${contest.category}
          대상: ${contest.targetAudience}
          지원금액: ${contest.maxAmount ? contest.maxAmount + '만원' : '정보 없음'}
          지원기간: ${contest.supportPeriod ? contest.supportPeriod + '개월' : '정보 없음'}
          지역: ${contest.region || '전국'}
        `;

        const matchingScore = await claudeAnalyzer.generateMatchingScore(
          analysisResult,
          contestDescription,
          regionData
        );

        // 추천 이유 생성
        const reasons = await claudeAnalyzer.generateRecommendationReasons(
          analysisResult,
          contest.title,
          matchingScore
        );

        const matchScore: MatchScore = {
          totalScore: matchingScore,
          breakdown: {
            populationMatch: Math.floor(matchingScore * 0.3),
            competitionLevel: Math.floor(matchingScore * 0.25),
            infrastructureScore: Math.floor(matchingScore * 0.25),
            historicalSuccess: Math.floor(matchingScore * 0.2),
          },
        };

        return {
          contest,
          matchScore,
          reasons,
        };
      })
    );

    // 5. 매칭 점수 순으로 정렬하고 상위 5개만 반환
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore)
      .slice(0, 5);

    // 6. 분석 결과를 데이터베이스에 저장 (임시 사용자 ID 사용)
    try {
      await prisma.analysis.create({
        data: {
          userId: 'temp-user-' + Date.now(), // 실제 구현에서는 세션 기반 사용자 ID 사용
          businessType: userInput.businessType,
          teamSize: userInput.teamSize,
          targetRegion: userInput.targetRegion || null,
          ideaDescription: userInput.ideaDescription,
          recommendations: JSON.stringify(sortedRecommendations),
        },
      });
    } catch (error) {
      console.warn('Failed to save analysis to database:', error);
    }

    return NextResponse.json({
      recommendations: sortedRecommendations,
      analysisResult,
      totalContests: contests.length,
    });

  } catch (error) {
    console.error('Analysis API error:', error);

    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Analysis API endpoint' });
}