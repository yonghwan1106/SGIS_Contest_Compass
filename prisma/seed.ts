import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleContests = [
  {
    title: '2024 K-Global Startup 창업경진대회',
    organizer: 'K-Startup (창업진흥원)',
    category: 'IT/소프트웨어',
    maxAmount: 10000,
    supportPeriod: 12,
    region: '전국',
    targetAudience: '초기창업팀, 예비창업자',
    deadline: new Date('2025-12-31'),
    url: 'https://k-startup.go.kr',
    isActive: true,
  },
  {
    title: '혁신창업 리그 2024',
    organizer: '중소벤처기업부',
    category: '제조업',
    maxAmount: 5000,
    supportPeriod: 6,
    region: '대구광역시',
    targetAudience: '제조 스타트업',
    deadline: new Date('2025-11-30'),
    url: 'https://mss.go.kr',
    isActive: true,
  },
  {
    title: '바이오헬스 창업챌린지',
    organizer: '한국바이오협회',
    category: '바이오/의료',
    maxAmount: 8000,
    supportPeriod: 18,
    region: '경기도',
    targetAudience: '바이오 분야 창업팀',
    deadline: new Date('2025-01-15'),
    url: 'https://bio.org',
    isActive: true,
  },
  {
    title: 'ESG 사회혁신 창업경진대회',
    organizer: '사회혁신기업육성재단',
    category: '환경/에너지',
    maxAmount: 3000,
    supportPeriod: 12,
    region: '서울특별시',
    targetAudience: '사회적 기업, 소셜벤처',
    deadline: new Date('2025-12-15'),
    url: 'https://socialventure.or.kr',
    isActive: true,
  },
  {
    title: '농식품 창업 아이디어 공모전',
    organizer: '농림축산식품부',
    category: '농업/식품',
    maxAmount: 2000,
    supportPeriod: 9,
    region: '전라남도',
    targetAudience: '농식품 관련 창업팀',
    deadline: new Date('2025-10-31'),
    url: 'https://mafra.go.kr',
    isActive: true,
  },
  {
    title: '에듀테크 혁신 챌린지',
    organizer: '교육부',
    category: '교육',
    maxAmount: 4000,
    supportPeriod: 12,
    region: '세종특별자치시',
    targetAudience: '교육 혁신 스타트업',
    deadline: new Date('2025-11-20'),
    url: 'https://moe.go.kr',
    isActive: true,
  },
  {
    title: '핀테크 혁신 아이디어 경진대회',
    organizer: '금융위원회',
    category: '금융/핀테크',
    maxAmount: 15000,
    supportPeriod: 24,
    region: '서울특별시',
    targetAudience: '핀테크 스타트업',
    deadline: new Date('2025-02-28'),
    url: 'https://fsc.go.kr',
    isActive: true,
  },
  {
    title: '문화콘텐츠 창업지원 프로그램',
    organizer: '문화체육관광부',
    category: '문화/콘텐츠',
    maxAmount: 6000,
    supportPeriod: 15,
    region: '부산광역시',
    targetAudience: '문화콘텐츠 창업팀',
    deadline: new Date('2025-12-10'),
    url: 'https://mcst.go.kr',
    isActive: true,
  },
  {
    title: '스마트시티 솔루션 챌린지',
    organizer: '국토교통부',
    category: 'IT/소프트웨어',
    maxAmount: 12000,
    supportPeriod: 18,
    region: '인천광역시',
    targetAudience: '스마트시티 관련 스타트업',
    deadline: new Date('2025-01-31'),
    url: 'https://molit.go.kr',
    isActive: true,
  },
  {
    title: '청년창업 아이디어 경진대회',
    organizer: '고용노동부',
    category: '유통/서비스',
    maxAmount: 3500,
    supportPeriod: 12,
    region: '광주광역시',
    targetAudience: '청년 예비창업자',
    deadline: new Date('2025-11-25'),
    url: 'https://moel.go.kr',
    isActive: true,
  },
];

const sampleSgisData = [
  {
    regionCode: '11',
    regionName: '서울특별시',
    dataType: 'population',
    ageGroup: '20-29',
    value: 1200000,
    year: 2023,
  },
  {
    regionCode: '11',
    regionName: '서울특별시',
    dataType: 'business',
    businessType: 'IT/소프트웨어',
    value: 25000,
    year: 2023,
  },
  {
    regionCode: '26',
    regionName: '부산광역시',
    dataType: 'population',
    ageGroup: '30-39',
    value: 450000,
    year: 2023,
  },
  {
    regionCode: '26',
    regionName: '부산광역시',
    dataType: 'business',
    businessType: '제조업',
    value: 8000,
    year: 2023,
  },
  {
    regionCode: '41',
    regionName: '경기도',
    dataType: 'startup',
    businessType: '바이오/의료',
    value: 1200,
    year: 2023,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  try {
    // 기존 데이터 삭제 (옵션)
    await prisma.analysis.deleteMany();
    await prisma.sgisData.deleteMany();
    await prisma.contest.deleteMany();

    console.log('📝 Creating sample contests...');

    // 공모전 데이터 생성
    for (const contest of sampleContests) {
      await prisma.contest.create({
        data: contest,
      });
    }

    console.log('📊 Creating sample SGIS data...');

    // SGIS 데이터 생성
    for (const data of sampleSgisData) {
      await prisma.sgisData.create({
        data: data as any,
      });
    }

    console.log('✅ Seed completed successfully!');

    const contestCount = await prisma.contest.count();
    const sgisDataCount = await prisma.sgisData.count();

    console.log(`📈 Created ${contestCount} contests and ${sgisDataCount} SGIS data entries`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });