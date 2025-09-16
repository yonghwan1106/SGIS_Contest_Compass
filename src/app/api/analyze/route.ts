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
    const contests = await prisma.contest.findMany({
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
        // 실제 SGIS API 호출은 나중에 구현
        // regionData = await sgisClient.getPopulationData(userInput.targetRegion);
      } catch (error) {
        console.warn('SGIS data fetch failed:', error);
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