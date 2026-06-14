// 한양대 ERICA 캠퍼스 주요 건물 좌표 (위도, 경도)
export const CAMPUS_BUILDINGS: Record<string, { lat: number; lng: number; address: string }> = {
    '학연산클러스터지원센터': { lat: 37.2968381, lng: 126.838973, address: '경기 안산시 상록구 한양대학로 55' },
    '버스승강장': { lat: 37.298728, lng: 126.837990, address: '경기 안산시 상록구 한양대학로 55' },
    '제1공학관': { lat: 37.297819, lng: 126.836960, address: '경기 안산시 상록구 한양대학로 55' },
    '학술정보관': { lat: 37.296817, lng: 126.835313, address: '경기 안산시 상록구 한양대학로 55' },
    '컨퍼런스홀': { lat: 37.299056, lng: 126.836822, address: '경기 안산시 상록구 한양대학로 55' },
    '창의관': { lat: 37.291397, lng: 126.836301, address: '경기 안산시 상록구 한양대학로 55' },
};

// 호수 → 해당 건물로 매핑 (새로운 건물에 맞추어 예시 변경 가능)
export const ROOM_TO_BUILDING: Record<string, string> = {
    '101호': '제1공학관',
    '102호': '제1공학관',
    '201호': '학술정보관',
    '301호': '창의관',
    // 필요시 여기에 추가...
};

// 건물명 검색 헬퍼 함수
export const findBuildingCoords = (query: string): { lat: number; lng: number; address: string; name: string } | null => {
    const trimmed = query.trim();

    // 1. 호수 → 건물명 변환
    const buildingName = ROOM_TO_BUILDING[trimmed] || trimmed;

    // 2. 건물명 → 좌표 찾기 (부분 일치 포함)
    for (const [key, value] of Object.entries(CAMPUS_BUILDINGS)) {
        if (key.includes(buildingName) || buildingName.includes(key)) {
            return { ...value, name: key };
        }
    }

    return null;
};