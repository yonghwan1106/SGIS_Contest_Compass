import axios from 'axios';
import { SgisApiConfig, PopulationData, BusinessData } from '@/types';

export class SGISClient {
  private baseURL = 'https://sgis.kostat.go.kr/OpenAPI3';
  private serviceId: string;
  private securityKey: string;

  constructor() {
    this.serviceId = process.env.SGIS_SERVICE_ID || '';
    this.securityKey = process.env.SGIS_SECURITY_KEY || '';

    if (!this.serviceId || !this.securityKey) {
      console.warn('SGIS API credentials not found in environment variables');
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          serviceKey: this.securityKey,
          ...params,
        },
        timeout: 10000,
      });

      if (response.data?.result?.code === '00') {
        return response.data.result;
      } else {
        throw new Error(`SGIS API Error: ${response.data?.result?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('SGIS API Request Error:', error);
      throw error;
    }
  }

  // 시도 목록 조회
  async getSidoList(): Promise<any[]> {
    try {
      const result = await this.makeRequest('/boundary/sido/geojson', {
        year: '2023',
      });
      return result.features || [];
    } catch (error) {
      console.error('Error fetching sido list:', error);
      return [];
    }
  }

  // 시군구 목록 조회
  async getSigunguList(sidoCode: string): Promise<any[]> {
    try {
      const result = await this.makeRequest('/boundary/sigungu/geojson', {
        year: '2023',
        sido_cd: sidoCode,
      });
      return result.features || [];
    } catch (error) {
      console.error('Error fetching sigungu list:', error);
      return [];
    }
  }

  // 인구 데이터 조회
  async getPopulationData(regionCode: string): Promise<PopulationData | null> {
    try {
      const result = await this.makeRequest('/stats/searchpopulation', {
        year: '2023',
        low_search: regionCode,
      });

      if (!result.data || result.data.length === 0) {
        return null;
      }

      const data = result.data[0];
      return {
        regionCode,
        regionName: data.adm_nm || '',
        totalPopulation: parseInt(data.population) || 0,
        ageGroups: this.parseAgeGroups(data),
      };
    } catch (error) {
      console.error('Error fetching population data:', error);
      return null;
    }
  }

  // 사업체 데이터 조회
  async getBusinessData(regionCode: string, businessType?: string): Promise<BusinessData[]> {
    try {
      const result = await this.makeRequest('/stats/searchbusiness', {
        year: '2023',
        low_search: regionCode,
        ...(businessType && { indutype_cd: businessType }),
      });

      if (!result.data || result.data.length === 0) {
        return [];
      }

      return result.data.map((item: any) => ({
        regionCode,
        regionName: item.adm_nm || '',
        businessType: item.indutype_nm || businessType || '',
        count: parseInt(item.company_cnt) || 0,
        employeeCount: parseInt(item.employee_cnt) || 0,
      }));
    } catch (error) {
      console.error('Error fetching business data:', error);
      return [];
    }
  }

  private parseAgeGroups(data: any): { [key: string]: number } {
    const ageGroups: { [key: string]: number } = {};

    // SGIS API의 연령대별 데이터 파싱 로직
    // 실제 API 응답 구조에 따라 수정 필요
    if (data.age_10) ageGroups['10대'] = parseInt(data.age_10) || 0;
    if (data.age_20) ageGroups['20대'] = parseInt(data.age_20) || 0;
    if (data.age_30) ageGroups['30대'] = parseInt(data.age_30) || 0;
    if (data.age_40) ageGroups['40대'] = parseInt(data.age_40) || 0;
    if (data.age_50) ageGroups['50대'] = parseInt(data.age_50) || 0;
    if (data.age_60) ageGroups['60대 이상'] = parseInt(data.age_60) || 0;

    return ageGroups;
  }
}

export const sgisClient = new SGISClient();