import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
              📊 SGIS 활용 우수사례 공모전 출품작
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contest Compass란?
          </h1>
          <p className="text-xl text-gray-600">
            SGIS 통계 데이터와 AI를 결합하여 창업자에게 최적화된 공모전을 추천하는 혁신적 웹 플랫폼
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">우리의 미션</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                창업자들이 수많은 공모전 중에서 자신에게 가장 적합한 기회를 찾는 것은 쉽지 않습니다.
                Contest Compass는 이런 어려움을 해결하기 위해 탄생했습니다.
              </p>
              <p>
                통계청의 SGIS 데이터와 최첨단 AI 기술을 활용하여, 각 창업자의 아이디어와
                지역적 특성을 종합적으로 분석하고 맞춤형 공모전을 추천합니다.
              </p>
              <p>
                우리의 목표는 모든 창업자가 자신의 잠재력을 최대한 발휘할 수 있는
                최적의 기회를 찾을 수 있도록 돕는 것입니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">핵심 기술</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">SGIS 통계 데이터</h3>
                  <p className="text-gray-600 text-sm">통계청의 실시간 지역별 인구, 사업체 데이터를 활용한 정확한 시장 분석</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Claude Sonnet 4.0 AI</h3>
                  <p className="text-gray-600 text-sm">최첨단 AI 모델을 활용한 아이디어 분석 및 지능형 매칭 시스템</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">예측 알고리즘</h3>
                  <p className="text-gray-600 text-sm">지역별 경쟁 현황과 과거 성과를 바탕으로 한 성공 확률 예측</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contest Compass 활용법</h2>
            <p className="text-gray-600">4단계로 완성되는 맞춤형 공모전 추천</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">아이디어 입력</h3>
              <p className="text-gray-600 text-sm">사업 분야, 팀 규모, 아이디어 설명 등 기본 정보를 입력합니다</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI 분석</h3>
              <p className="text-gray-600 text-sm">Claude AI가 입력된 정보를 분석하여 핵심 키워드와 특성을 추출합니다</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">데이터 매칭</h3>
              <p className="text-gray-600 text-sm">SGIS 지역 데이터와 공모전 정보를 종합하여 매칭 점수를 계산합니다</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">추천 결과</h3>
              <p className="text-gray-600 text-sm">매칭도가 높은 순으로 정렬된 맞춤형 공모전 목록을 제공합니다</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">정확성</h3>
            <p className="text-gray-600 mb-4">
              통계청의 공식 SGIS 데이터를 활용하여 높은 신뢰도의 분석 결과를 제공합니다.
            </p>
            <div className="text-3xl font-bold text-indigo-600">95%</div>
            <p className="text-sm text-gray-500">데이터 정확도</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">효율성</h3>
            <p className="text-gray-600 mb-4">
              복잡한 분석 과정을 AI가 자동화하여 몇 분 만에 결과를 확인할 수 있습니다.
            </p>
            <div className="text-3xl font-bold text-indigo-600">&lt;3분</div>
            <p className="text-sm text-gray-500">평균 분석 시간</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">포용성</h3>
            <p className="text-gray-600 mb-4">
              전국 모든 지역과 다양한 업종의 공모전 정보를 망라적으로 제공합니다.
            </p>
            <div className="text-3xl font-bold text-indigo-600">100+</div>
            <p className="text-sm text-gray-500">등록된 공모전</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">지금 바로 시작해보세요</h2>
          <p className="text-gray-300 mb-8">
            Contest Compass와 함께 당신의 창업 여정을 시작해보세요.
            AI와 빅데이터가 당신만을 위한 최적의 기회를 찾아드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analysis"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              분석 시작하기
            </Link>
            <Link
              href="/contests"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              공모전 둘러보기
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">개발 정보</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">기술 스택</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Frontend: Next.js 14, TypeScript, Tailwind CSS</li>
                  <li>• Backend: Next.js API Routes, Prisma ORM</li>
                  <li>• Database: SQLite</li>
                  <li>• AI: Claude Sonnet 4.0 API</li>
                  <li>• Data: SGIS OpenAPI</li>
                  <li>• Deployment: Vercel</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">개발 목적</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• SGIS 공모전 참여작</li>
                  <li>• 창업 생태계 혁신</li>
                  <li>• 데이터 기반 의사결정 지원</li>
                  <li>• AI 기술 실용화</li>
                  <li>• 사회적 가치 창출</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}