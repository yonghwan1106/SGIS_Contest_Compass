'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnalysisForm from '@/components/forms/AnalysisForm';
import { UserInput, ContestRecommendation } from '@/types';

export default function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ContestRecommendation[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalysis = async (formData: UserInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResults(data.recommendations);
      setAnalysisResult(data.analysisResult);

      // 결과가 있으면 결과 섹션으로 스크롤
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
              📊 SGIS 활용 우수사례 공모전 출품작
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            창업 아이디어 분석
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            🤖 Claude AI와 📈 SGIS 통계 데이터의 만남으로<br/>
            <span className="font-semibold text-indigo-600">맞춤형 공모전을 추천</span>받으세요
          </p>

          {/* 프로세스 미리보기 */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔮 분석 프로세스 미리보기</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span className="text-lg">🧠</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">AI 분석</p>
                  <p className="text-xs text-gray-500">키워드 추출</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span className="text-lg">📊</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">데이터 분석</p>
                  <p className="text-xs text-gray-500">SGIS 통계</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span className="text-lg">🎯</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">매칭 계산</p>
                  <p className="text-xs text-gray-500">점수 산정</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span className="text-lg">🏆</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">결과 도출</p>
                  <p className="text-xs text-gray-500">추천 완료</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <AnalysisForm onSubmit={handleAnalysis} loading={loading} />

      {/* 로딩 상태 */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🤖 AI 분석 중</h3>
              <p className="text-gray-600 mb-4">Claude AI가 당신의 아이디어를 분석하고 있습니다</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <span>키워드 추출 중...</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span>SGIS 데이터 분석 중...</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  <span>매칭 점수 계산 중...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">⚠️ 분석 중 오류가 발생했습니다</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  다시 시도하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysisResult && (
        <div id="analysis-results" className="mt-24 relative">
          {/* 배경 장식 */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl transform rotate-1"></div>

          <div className="relative bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <div className="text-center">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  분석 완료
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  🧠 AI 분석 결과
                </h2>
                <p className="text-indigo-100">
                  Claude AI가 당신의 창업 아이디어를 종합 분석했습니다
                </p>
              </div>
            </div>

            {/* AI 분석 결과 카드 */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 핵심 키워드 */}
                <div className="group">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-xl">🏷️</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">핵심 키워드</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords?.map((keyword: string, index: number) => (
                        <span key={index} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 비즈니스 모델 */}
                <div className="group">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-xl">🏢</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">비즈니스 모델</h3>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200">
                      <p className="text-gray-700 font-medium text-lg">
                        {analysisResult.businessModel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 타겟 고객 */}
                <div className="group">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-xl">👥</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">타겟 고객</h3>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                      <p className="text-gray-700 font-medium">
                        {analysisResult.targetCustomer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 경쟁 우위 */}
                <div className="group">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-white text-xl">🏆</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">경쟁 우위</h3>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200">
                      <p className="text-gray-700 font-medium">
                        {analysisResult.competitiveAdvantage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 분석 과정 설명 */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border-2 border-indigo-100 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                  프로세스 완료
                </div>
                <h3 className="text-2xl font-bold text-gray-900">🔍 분석 과정 상세</h3>
                <p className="text-gray-600 mt-2">다음 4단계를 통해 정밀한 분석을 수행했습니다</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    1
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">키워드 추출</h4>
                  <p className="text-sm text-gray-600">Claude AI가 아이디어에서 핵심 키워드를 추출했습니다</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    2
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">시장 분석</h4>
                  <p className="text-sm text-gray-600">SGIS 데이터를 활용해 타겟 시장을 분석했습니다</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    3
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">매칭 계산</h4>
                  <p className="text-sm text-gray-600">AI가 공모전별 매칭 점수를 계산했습니다</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    4
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">결과 도출</h4>
                  <p className="text-sm text-gray-600">최적의 공모전을 순위별로 추천했습니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div id="recommendations" className="mt-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              추천 완료
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              🎯 맞춤형 공모전 추천
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              🧠 AI 분석 결과를 바탕으로 <span className="font-bold text-green-600">{results.length}개</span>의 최적 매칭 공모전을 찾았습니다
            </p>
            <div className="mt-6 inline-flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
              <span className="text-green-500 mr-2">●</span>
              매칭도 높은 순으로 정렬됨
            </div>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {results.map((recommendation, index) => (
              <div key={recommendation.contest.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                          #{index + 1}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          매칭도 {recommendation.matchScore.totalScore}%
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {recommendation.contest.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        주최: {recommendation.contest.organizer} | 분야: {recommendation.contest.category}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">매칭 점수 분석</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">인구 매칭도</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{width: `${recommendation.matchScore.breakdown.populationMatch}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{recommendation.matchScore.breakdown.populationMatch}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">경쟁 강도</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{width: `${recommendation.matchScore.breakdown.competitionLevel}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{recommendation.matchScore.breakdown.competitionLevel}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">인프라 점수</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{width: `${recommendation.matchScore.breakdown.infrastructureScore}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{recommendation.matchScore.breakdown.infrastructureScore}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">과거 성과</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{width: `${recommendation.matchScore.breakdown.historicalSuccess}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{recommendation.matchScore.breakdown.historicalSuccess}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">추천 이유</h4>
                      <ul className="space-y-2">
                        {recommendation.reasons.map((reason, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600 text-sm">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">공모전 정보</h4>
                      <div className="space-y-2 text-sm">
                        {recommendation.contest.maxAmount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">지원금액:</span>
                            <span className="font-medium">{recommendation.contest.maxAmount.toLocaleString()}만원</span>
                          </div>
                        )}
                        {recommendation.contest.supportPeriod && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">지원기간:</span>
                            <span className="font-medium">{recommendation.contest.supportPeriod}개월</span>
                          </div>
                        )}
                        {recommendation.contest.region && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">대상지역:</span>
                            <span className="font-medium">{recommendation.contest.region}</span>
                          </div>
                        )}
                        {recommendation.contest.deadline && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">마감일:</span>
                            <span className="font-medium">
                              {new Date(recommendation.contest.deadline).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {recommendation.contest.url && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <a
                        href={recommendation.contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        공모전 상세 보기
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 분석이 완료되었습니다!</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Contest Compass가 SGIS 통계 데이터와 Claude AI를 활용하여
                당신의 창업 아이디어에 가장 적합한 공모전들을 선별했습니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  🔄 새로운 분석하기
                </button>
                <a
                  href="/contests"
                  className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                >
                  📋 전체 공모전 보기
                </a>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 text-sm text-gray-600 border border-gray-200">
                  ✨ SGIS 활용 우수사례 공모전 출품작
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}