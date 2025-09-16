// User types
export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  createdAt: Date;
}

// Contest types
export interface Contest {
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
  createdAt: Date;
  updatedAt: Date;
}

// SGIS Data types
export interface SgisData {
  id: string;
  regionCode: string;
  regionName: string;
  dataType: 'population' | 'business' | 'startup';
  ageGroup?: string;
  businessType?: string;
  value: number;
  year: number;
  createdAt: Date;
}

// Analysis types
export interface UserInput {
  businessType: string;
  teamSize: string;
  targetRegion?: string;
  ideaDescription: string;
}

export interface Analysis {
  id: string;
  userId: string;
  businessType: string;
  teamSize: string;
  targetRegion?: string;
  ideaDescription: string;
  recommendations: string;
  createdAt: Date;
}

export interface AnalysisResult {
  keywords: string[];
  targetCustomer: string;
  businessModel: string;
  competitiveAdvantage: string;
}

export interface MatchScore {
  totalScore: number;
  breakdown: {
    populationMatch: number;
    competitionLevel: number;
    infrastructureScore: number;
    historicalSuccess: number;
  };
}

export interface ContestRecommendation {
  contest: Contest;
  matchScore: MatchScore;
  reasons: string[];
}

// SGIS API types
export interface SgisApiConfig {
  baseUrl: string;
  serviceId: string;
  securityKey: string;
  rateLimit: number;
}

export interface PopulationData {
  regionCode: string;
  regionName: string;
  totalPopulation: number;
  ageGroups: {
    [key: string]: number;
  };
}

export interface BusinessData {
  regionCode: string;
  regionName: string;
  businessType: string;
  count: number;
  employeeCount: number;
}

// Claude API types
export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}