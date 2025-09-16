'use client';

import { useState } from 'react';
import { UserInput } from '@/types';

interface AnalysisFormProps {
  onSubmit: (data: UserInput) => void;
  loading?: boolean;
}

export default function AnalysisForm({ onSubmit, loading = false }: AnalysisFormProps) {
  const [formData, setFormData] = useState<UserInput>({
    businessType: '',
    teamSize: '',
    targetRegion: '',
    ideaDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        창업 아이디어 분석
      </h2>

      <div className="space-y-6">
        {/* 사업 분야 */}
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
            사업 분야 *
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">사업 분야를 선택하세요</option>
            <option value="IT/소프트웨어">IT/소프트웨어</option>
            <option value="바이오/의료">바이오/의료</option>
            <option value="제조업">제조업</option>
            <option value="유통/서비스">유통/서비스</option>
            <option value="농업/식품">농업/식품</option>
            <option value="교육">교육</option>
            <option value="환경/에너지">환경/에너지</option>
            <option value="금융/핀테크">금융/핀테크</option>
            <option value="문화/콘텐츠">문화/콘텐츠</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 팀 규모 */}
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
            팀 규모 *
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">팀 규모를 선택하세요</option>
            <option value="1명 (개인)">1명 (개인)</option>
            <option value="2-3명">2-3명</option>
            <option value="4-6명">4-6명</option>
            <option value="7-10명">7-10명</option>
            <option value="10명 이상">10명 이상</option>
          </select>
        </div>

        {/* 희망 지역 */}
        <div>
          <label htmlFor="targetRegion" className="block text-sm font-medium text-gray-700 mb-2">
            희망 활동 지역
          </label>
          <select
            id="targetRegion"
            name="targetRegion"
            value={formData.targetRegion}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">지역을 선택하세요 (선택사항)</option>
            <option value="서울특별시">서울특별시</option>
            <option value="부산광역시">부산광역시</option>
            <option value="대구광역시">대구광역시</option>
            <option value="인천광역시">인천광역시</option>
            <option value="광주광역시">광주광역시</option>
            <option value="대전광역시">대전광역시</option>
            <option value="울산광역시">울산광역시</option>
            <option value="세종특별자치시">세종특별자치시</option>
            <option value="경기도">경기도</option>
            <option value="강원도">강원도</option>
            <option value="충청북도">충청북도</option>
            <option value="충청남도">충청남도</option>
            <option value="전라북도">전라북도</option>
            <option value="전라남도">전라남도</option>
            <option value="경상북도">경상북도</option>
            <option value="경상남도">경상남도</option>
            <option value="제주특별자치도">제주특별자치도</option>
          </select>
        </div>

        {/* 아이디어 설명 */}
        <div>
          <label htmlFor="ideaDescription" className="block text-sm font-medium text-gray-700 mb-2">
            창업 아이디어 설명 *
          </label>

          {/* 샘플 텍스트 버튼들 */}
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">💡 아래 샘플 중 하나를 선택해서 빠르게 테스트해보세요:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  businessType: 'IT/소프트웨어',
                  teamSize: '2-3명',
                  targetRegion: '서울특별시',
                  ideaDescription: 'AI 기반 개인 맞춤형 헬스케어 서비스입니다. 사용자의 생체 데이터(심박수, 혈압, 혈당 등)를 실시간으로 모니터링하고, 머신러닝을 통해 개인별 건강 위험 요소를 예측합니다. 의료진과의 원격 상담, 맞춤형 운동 처방, 식단 관리 등을 종합적으로 제공하여 예방 중심의 healthcare 생태계를 구축하고자 합니다.'
                }))}
                className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <div className="font-medium text-blue-900 text-sm">🏥 AI 헬스케어</div>
                <div className="text-xs text-blue-600">개인 맞춤형 건강 관리 서비스</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  businessType: '환경/에너지',
                  teamSize: '4-6명',
                  targetRegion: '경기도',
                  ideaDescription: '폐플라스틱을 활용한 친환경 건축 소재 개발 사업입니다. 해양 플라스틱과 생활 폐기물을 수거하여 특수 공정을 통해 고강도, 경량의 건축용 패널과 블록을 제조합니다. 기존 콘크리트 대비 30% 가벼우면서도 동일한 강도를 유지하며, 탄소 배출량을 50% 이상 줄일 수 있습니다. B2B 모델로 건설업체와 파트너십을 구축할 계획입니다.'
                }))}
                className="text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              >
                <div className="font-medium text-green-900 text-sm">♻️ 친환경 건축소재</div>
                <div className="text-xs text-green-600">폐플라스틱 업사이클링</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  businessType: '교육',
                  teamSize: '2-3명',
                  targetRegion: '부산광역시',
                  ideaDescription: 'VR/AR 기술을 활용한 실습형 직업교육 플랫폼입니다. 고위험 직종(용접, 화학공정, 의료수술 등)의 안전한 가상 실습 환경을 제공하고, 실제와 동일한 시뮬레이션을 통해 숙련도를 향상시킵니다. 교육기관, 기업체, 개인 학습자를 대상으로 SaaS 형태로 서비스하며, 학습 성과를 데이터로 분석하여 개인별 맞춤 커리큘럼을 제공합니다.'
                }))}
                className="text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              >
                <div className="font-medium text-purple-900 text-sm">🥽 VR 직업교육</div>
                <div className="text-xs text-purple-600">가상현실 실습 플랫폼</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  businessType: '농업/식품',
                  teamSize: '4-6명',
                  targetRegion: '전라남도',
                  ideaDescription: '스마트팜 기술을 활용한 로컬푸드 유통 플랫폼입니다. 지역 소농들의 IoT 기반 농장 데이터를 수집하여 최적의 재배 환경을 제공하고, 수확물의 품질과 이력을 블록체인으로 관리합니다. 직거래 플랫폼을 통해 소비자에게 신선하고 안전한 농산물을 공급하며, 농민에게는 안정적인 판로를 보장합니다. 지역 농업 활성화와 식품 안전성 향상을 동시에 실현하는 모델입니다.'
                }))}
                className="text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
              >
                <div className="font-medium text-orange-900 text-sm">🌱 스마트팜 플랫폼</div>
                <div className="text-xs text-orange-600">로컬푸드 유통 혁신</div>
              </button>
            </div>
          </div>

          <textarea
            id="ideaDescription"
            name="ideaDescription"
            value={formData.ideaDescription}
            onChange={handleChange}
            required
            rows={6}
            placeholder="해결하고자 하는 문제, 타겟 고객, 솔루션 등을 상세히 설명해주세요..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
          <div className="mt-1 text-xs text-gray-500">
            ✨ 위의 샘플을 클릭하면 자동으로 입력됩니다
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.businessType || !formData.teamSize || !formData.ideaDescription}
        className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '분석 중...' : '분석 시작하기'}
      </button>
    </form>
  );
}