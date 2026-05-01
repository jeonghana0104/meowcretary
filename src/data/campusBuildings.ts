// 한양대 ERICA 캠퍼스 주요 건물 좌표 (위도, 경도)
export const CAMPUS_BUILDINGS: Record<string, { lat: number; lng: number; address: string }> = {
    // 도서관/학습시설
    '학술정보관': { lat: 37.3005, lng: 126.8342, address: '경기 안산시 상록구 한양대학로 55' },
    '중앙도서관': { lat: 37.3005, lng: 126.8342, address: '경기 안산시 상록구 한양대학로 55' },
    '제1열람실': { lat: 37.3006, lng: 126.8343, address: '경기 안산시 상록구 한양대학로 55' },

    // 공학관
    '1공학관': { lat: 37.2998, lng: 126.8335, address: '경기 안산시 상록구 한양대학로 55' },
    '2공학관': { lat: 37.3001, lng: 126.8338, address: '경기 안산시 상록구 한양대학로 55' },
    '3공학관': { lat: 37.3003, lng: 126.8340, address: '경기 안산시 상록구 한양대학로 55' },
    '4공학관': { lat: 37.3007, lng: 126.8345, address: '경기 안산시 상록구 한양대학로 55' },
    '5공학관': { lat: 37.3010, lng: 126.8348, address: '경기 안산시 상록구 한양대학로 55' },

    // 강의동
    '본관': { lat: 37.3012, lng: 126.8350, address: '경기 안산시 상록구 한양대학로 55' },
    '신소재공학관': { lat: 37.2995, lng: 126.8330, address: '경기 안산시 상록구 한양대학로 55' },

    // 식당/카페
    '학생식당': { lat: 37.3008, lng: 126.8346, address: '경기 안산시 상록구 한양대학로 55' },
    '한양플라자': { lat: 37.3015, lng: 126.8355, address: '경기 안산시 상록구 한양대학로 55' },

    // 편의시설
    '학생회관': { lat: 37.3011, lng: 126.8349, address: '경기 안산시 상록구 한양대학로 55' },
    '체육관': { lat: 37.2990, lng: 126.8325, address: '경기 안산시 상록구 한양대학로 55' },
};

// 501호 같은 호수 → 해당 건물로 매핑
export const ROOM_TO_BUILDING: Record<string, string> = {
    '501호': '5공학관',
    '502호': '5공학관',
    '503호': '5공학관',
    '401호': '4공학관',
    '301호': '3공학관',
    // 필요시 추가...
};

// 건물명 검색 헬퍼 함수
export const findBuildingCoords = (query: string): { lat: number; lng: number; address: string; name: string } | null => {
    const trimmed = query.trim();

    // 1. 호수 → 건물명 변환 (예: "501호" → "5공학관")
    const buildingName = ROOM_TO_BUILDING[trimmed] || trimmed;

    // 2. 건물명 → 좌표 찾기 (부분 일치 포함)
    for (const [key, value] of Object.entries(CAMPUS_BUILDINGS)) {
        if (key.includes(buildingName) || buildingName.includes(key)) {
            return { ...value, name: key };
        }
    }

    return null;
};