import Anthropic from '@anthropic-ai/sdk';
import { UserInput, AnalysisResult, ContestRecommendation } from '@/types';

export class ClaudeAnalyzer {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    this.anthropic = new Anthropic({
      apiKey,
    });
  }

  async analyzeUserInput(input: UserInput): Promise<AnalysisResult> {
    const prompt = `
다음 사용자 정보를 분석하여 창업 아이템의 특성을 파악해주세요:

사용자 정보:
- 사업 분야: ${input.businessType}
- 팀 규모: ${input.teamSize}
- 아이디어 설명: ${input.ideaDescription}
- 희망 지역: ${input.targetRegion || '미정'}

다음 JSON 형식으로만 응답해주세요. 다른 설명은 포함하지 마세요:
{
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "targetCustomer": "주요 타겟 고객층 설명",
  "businessModel": "비즈니스 모델 유형 (B2B, B2C, B2G 등)",
  "competitiveAdvantage": "예상되는 경쟁 우위 요소"
}
`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      throw new Error('Invalid response format from Claude API');
    } catch (error) {
      console.error('Claude analysis error:', error);
      // Fallback response
      return {
        keywords: [input.businessType, '혁신', '창업'],
        targetCustomer: '일반 소비자',
        businessModel: 'B2C',
        competitiveAdvantage: '혁신적 아이디어',
      };
    }
  }

  async generateMatchingScore(
    userAnalysis: AnalysisResult,
    contestDescription: string,
    regionData?: any
  ): Promise<number> {
    const prompt = `
다음 정보를 바탕으로 사용자와 공모전의 매칭 점수를 0-100 사이로 계산해주세요:

사용자 분석:
- 핵심 키워드: ${userAnalysis.keywords.join(', ')}
- 타겟 고객: ${userAnalysis.targetCustomer}
- 비즈니스 모델: ${userAnalysis.businessModel}
- 경쟁 우위: ${userAnalysis.competitiveAdvantage}

공모전 정보:
${contestDescription}

지역 데이터:
${regionData ? JSON.stringify(regionData) : '데이터 없음'}

0-100 사이의 숫자로만 응답해주세요:
`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const score = parseInt(content.text.trim());
        return Math.min(Math.max(score, 0), 100);
      }

      return 50; // Default score
    } catch (error) {
      console.error('Claude matching score error:', error);
      return 50; // Default score
    }
  }

  async generateRecommendationReasons(
    userAnalysis: AnalysisResult,
    contestTitle: string,
    matchScore: number
  ): Promise<string[]> {
    const prompt = `
다음 정보를 바탕으로 이 공모전을 추천하는 3가지 구체적인 이유를 생성해주세요:

사용자 분석:
- 핵심 키워드: ${userAnalysis.keywords.join(', ')}
- 타겟 고객: ${userAnalysis.targetCustomer}
- 비즈니스 모델: ${userAnalysis.businessModel}

공모전: ${contestTitle}
매칭 점수: ${matchScore}/100

다음 JSON 형식으로만 응답해주세요:
{
  "reasons": ["이유1", "이유2", "이유3"]
}
`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return result.reasons || [];
        }
      }

      return ['매칭되는 사업 분야', '적절한 지원 규모', '성장 가능성'];
    } catch (error) {
      console.error('Claude recommendation reasons error:', error);
      return ['매칭되는 사업 분야', '적절한 지원 규모', '성장 가능성'];
    }
  }
}

export const claudeAnalyzer = new ClaudeAnalyzer();