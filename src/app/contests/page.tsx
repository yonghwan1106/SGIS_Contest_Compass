import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Contest } from '@/types';

async function getContests(): Promise<Contest[]> {
  try {
    const contests = await prisma.contest.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        deadline: 'asc', // 마감일 순으로 정렬
      },
    });

    return contests.map(contest => ({
      ...contest,
      deadline: contest.deadline ? new Date(contest.deadline) : undefined,
      createdAt: new Date(contest.createdAt),
      updatedAt: new Date(contest.updatedAt),
    }));
  } catch (error) {
    console.warn('Database not available, using fallback data:', error);
    // Vercel에서 SQLite를 사용할 수 없는 경우 하드코딩된 데이터 사용
    return [
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
}

export default async function ContestsPage() {
  const contests = await getContests();

  const getStatusBadge = (deadline?: Date | null) => {
    if (!deadline) return null;

    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">마감</span>;
    } else if (daysLeft <= 7) {
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">마감임박</span>;
    } else if (daysLeft <= 30) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">D-{daysLeft}</span>;
    } else {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">접수중</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'IT/소프트웨어': 'bg-blue-100 text-blue-800',
      '바이오/의료': 'bg-green-100 text-green-800',
      '제조업': 'bg-gray-100 text-gray-800',
      '유통/서비스': 'bg-purple-100 text-purple-800',
      '농업/식품': 'bg-yellow-100 text-yellow-800',
      '교육': 'bg-indigo-100 text-indigo-800',
      '환경/에너지': 'bg-emerald-100 text-emerald-800',
      '금융/핀테크': 'bg-pink-100 text-pink-800',
      '문화/콘텐츠': 'bg-rose-100 text-rose-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            📊 SGIS 활용 우수사례 공모전 출품작
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          진행중인 공모전
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          현재 신청 가능한 창업 관련 공모전 {contests.length}개
        </p>
        <Link
          href="/analysis"
          className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          맞춤 공모전 찾기
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {contests.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">진행중인 공모전이 없습니다</h3>
          <p className="text-gray-500">새로운 공모전이 등록될 때까지 기다려주세요.</p>
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {contests.map((contest) => (
            <div key={contest.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(contest.category)}`}>
                      {contest.category}
                    </span>
                    {getStatusBadge(contest.deadline)}
                  </div>
                  {contest.deadline && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">마감일</p>
                      <p className="text-sm font-medium text-gray-900">
                        {contest.deadline.toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                  {contest.title}
                </h2>

                <p className="text-gray-600 mb-4">
                  주최: {contest.organizer}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-600">대상: </span>
                      <span className="font-medium ml-1">{contest.targetAudience}</span>
                    </div>

                    {contest.region && (
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600">지역: </span>
                        <span className="font-medium ml-1">{contest.region}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {contest.maxAmount && (
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-gray-600">지원금: </span>
                        <span className="font-medium ml-1 text-green-600">{contest.maxAmount.toLocaleString()}만원</span>
                      </div>
                    )}

                    {contest.supportPeriod && (
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">기간: </span>
                        <span className="font-medium ml-1">{contest.supportPeriod}개월</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <Link
                      href="/analysis"
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                    >
                      매칭 분석하기
                    </Link>
                  </div>

                  {contest.url && (
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      상세 보기
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            더 정확한 추천을 원한다면?
          </h3>
          <p className="text-gray-600 mb-6">
            AI 분석을 통해 당신의 아이디어에 가장 적합한 공모전을 찾아보세요.
          </p>
          <Link
            href="/analysis"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            맞춤 분석 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}