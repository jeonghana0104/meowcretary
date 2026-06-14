package com.example.backend.ai.service;

import java.util.*;

public class CampusRouteDatabase {

    public static class RouteInfo {
        public String placeName;
        public String description;
        public String targetLocation;
        public String polylineCoordinates;

        public RouteInfo(String placeName, String description, String targetLocation, String polylineCoordinates) {
            this.placeName = placeName;
            this.description = description;
            this.targetLocation = targetLocation;
            this.polylineCoordinates = polylineCoordinates;
        }
    }

    private static final Map<String, RouteInfo> DATABASE = new HashMap<>();

    // ── 🗺️ 고정밀 그래프 내비게이션 데이터 구조 ──
    private static final Map<String, String> NODE_COORDS = new HashMap<>();
    private static final Map<String, List<String>> GRAPH = new HashMap<>();

    static {
        // 1. 📍 사용자가 준 6대 장소 실측 좌표 및 기본 설명 등록
        DATABASE.put("학연산클러스터지원센터", new RouteInfo("학연산클러스터지원센터", "언론정보관 우측 도로를 지나 학연산 전용 진입로 안쪽에 있습니다.", "37.296838,126.838973", ""));
        DATABASE.put("버스승강장", new RouteInfo("버스승강장", "셔틀콕 동측 주차장 라인 아래쪽에 위치한 순환버스 정류장입니다.", "37.298728,126.837990", ""));
        DATABASE.put("제1공학관", new RouteInfo("제1공학관", "본관 왼쪽을 지나 제1과학기술관 모퉁이 우측에 정문이 있습니다.", "37.297819,126.836960", ""));
        DATABASE.put("학술정보관", new RouteInfo("학술정보관", "사자상과 민주광장을 지나 학생복지관 옆에 위치한 대형 도서관입니다.", "37.296817,126.835313", ""));
        DATABASE.put("컨퍼런스홀", new RouteInfo("컨퍼런스홀", "언론정보관 교차로 우측 주차장 진입로 옆에 있습니다.", "37.299056,126.836822", ""));
        DATABASE.put("창의관", new RouteInfo("창의관", "대운동장 인근을 지나 캠퍼스 남단 최외곽에 위치해 있습니다.", "37.291397,126.836301", ""));

        // 별칭 매핑
        DATABASE.put("학연산", DATABASE.get("학연산클러스터지원센터"));
        DATABASE.put("클러스터", DATABASE.get("학연산클러스터지원센터"));
        DATABASE.put("정류장", DATABASE.get("버스승강장"));
        DATABASE.put("공학관", DATABASE.get("제1공학관"));
        DATABASE.put("도서관", DATABASE.get("학술정보관"));
        DATABASE.put("중도", DATABASE.get("학술정보관"));
        DATABASE.put("컨퍼런스", DATABASE.get("컨퍼런스홀"));

        // 2. 🗺️ 캠퍼스 내 모든 골목길/모퉁이(코너) 거점 좌표 정의 (자석 역할)
        NODE_COORDS.put("셔틀콕", "37.300890,126.833750");
        NODE_COORDS.put("본관앞코너", "37.300250,126.834050");
        NODE_COORDS.put("언론정보관코너", "37.300400,126.835100");
        NODE_COORDS.put("민주광장삼거리", "37.299580,126.834520");
        NODE_COORDS.put("복지관사거리", "37.299400,126.833900");
        NODE_COORDS.put("공학관진입로", "37.299220,126.834880");
        NODE_COORDS.put("과기전 전면", "37.298810,126.835430");
        NODE_COORDS.put("디자인대사거리", "37.299650,126.836200");
        NODE_COORDS.put("운동장교차로", "37.296500,126.834100");
        NODE_COORDS.put("기숙사삼거리", "37.294200,126.834500");
        NODE_COORDS.put("남단진입로", "37.292500,126.835500");

        // 목적지 노드들도 위치 동기화
        NODE_COORDS.put("학연산클러스터지원센터", "37.296838,126.838973");
        NODE_COORDS.put("버스승강장", "37.298728,126.837990");
        NODE_COORDS.put("제1공학관", "37.297819,126.836960");
        NODE_COORDS.put("학술정보관", "37.296817,126.835313");
        NODE_COORDS.put("컨퍼런스홀", "37.299056,126.836822");
        NODE_COORDS.put("창의관", "37.291397,126.836301");

        // 3. 🔗 코너와 코너 사이를 실제 연결된 길 형태로 맵핑 (간선 연결)
        connect("셔틀콕", "본관앞코너");
        connect("셔틀콕", "언론정보관코너");
        connect("본관앞코너", "민주광장삼거리");
        connect("민주광장삼거리", "복지관사거리");
        connect("민주광장삼거리", "공학관진입로");
        connect("공학관진입로", "과기전 전면");
        connect("과기전 전면", "제1공학관");
        connect("언론정보관코너", "디자인대사거리");
        connect("디자인대사거리", "컨퍼런스홀");
        connect("디자인대사거리", "버스승강장");
        connect("버스승강장", "학연산클러스터지원센터");
        connect("복지관사거리", "학술정보관");
        connect("복지관사거리", "운동장교차로");
        connect("운동장교차로", "기숙사삼거리");
        connect("기숙사삼거리", "남단진입로");
        connect("남단진입로", "창의관");
    }

    private static void connect(String u, String v) {
        GRAPH.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        GRAPH.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
    }

    public static RouteInfo retrieveContext(String message) {
        for (String key : DATABASE.keySet()) {
            if (message.contains(key)) {
                return DATABASE.get(key);
            }
        }
        return null;
    }

    // 사용자의 현위치에서 가장 가까운 도로망 진입점 코너 찾기
    public static String findClosestNode(double userLat, double userLng) {
        String closestNode = "셔틀콕";
        double minDistance = Double.MAX_VALUE;

        for (Map.Entry<String, String> entry : NODE_COORDS.entrySet()) {
            // 목적지용 노드는 최초 진입점 매핑에서 제외하여 코너 위주로 잡기
            if(DATABASE.containsKey(entry.getKey()) && !entry.getKey().equals("버스승강장")) continue;

            String[] parts = entry.getValue().split(",");
            double lat = Double.parseDouble(parts[0]);
            double lng = Double.parseDouble(parts[1]);
            double dist = Math.pow(lat - userLat, 2) + Math.pow(lng - userLng, 2); // 단순 유클리드 거리비교
            if (dist < minDistance) {
                minDistance = dist;
                closestNode = entry.getKey();
            }
        }
        return NODE_COORDS.get(closestNode);
    }

    /**
     * 🔥 [다익스트라 알고리즘 내장]
     * 현위치 코너 노드에서 목적지 건물 노드까지 코너들을 타고 최단거리 경로를 자동 생성합니다.
     */
    public static String calculateSmartPath(double userLat, double userLng, String targetPlace) {
        // 1. 내 GPS와 가장 가까운 출발점 노드 이름 찾기
        String startNode = "셔틀콕";
        double minStartDist = Double.MAX_VALUE;
        for (Map.Entry<String, String> entry : NODE_COORDS.entrySet()) {
            String[] parts = entry.getValue().split(",");
            double dist = Math.pow(Double.parseDouble(parts[0]) - userLat, 2) + Math.pow(Double.parseDouble(parts[1]) - userLng, 2);
            if (dist < minStartDist) {
                minStartDist = dist;
                startNode = entry.getKey();
            }
        }

        String endNode = targetPlace;
        if (!NODE_COORDS.containsKey(endNode)) return NODE_COORDS.get(startNode);

        // 2. 다익스트라 최단 코너 탐색 수행
        Map<String, Double> distances = new HashMap<>();
        Map<String, String> parentNodes = new HashMap<>();
        PriorityQueue<String[]> pq = new PriorityQueue<>(Comparator.comparingDouble(a -> Double.parseDouble(a[1])));

        for (String node : NODE_COORDS.keySet()) distances.put(node, Double.MAX_VALUE);
        distances.put(startNode, 0.0);
        pq.add(new String[]{startNode, "0.0"});

        while (!pq.isEmpty()) {
            String[] current = pq.poll();
            String currName = current[0];
            double currDist = Double.parseDouble(current[1]);

            if (currDist > distances.get(currName)) continue;
            if (currName.equals(endNode)) break;

            List<String> neighbors = GRAPH.getOrDefault(currName, new ArrayList<>());
            for (String neighbor : neighbors) {
                // 두 코너 거리를 가중치로 계산
                double edgeWeight = getDistanceBetweenNodes(currName, neighbor);
                double newDist = currDist + edgeWeight;

                if (newDist < distances.get(neighbor)) {
                    distances.put(neighbor, newDist);
                    parentNodes.put(neighbor, currName);
                    pq.add(new String[]{neighbor, String.valueOf(newDist)});
                }
            }
        }

        // 3. 코너 역추적 후 프론트엔드가 원하는 "lat,lng -> lat,lng" 문자열 체인 완성
        List<String> pathNodes = new ArrayList<>();
        String step = endNode;
        while (step != null) {
            pathNodes.add(0, NODE_COORDS.get(step));
            step = parentNodes.get(step);
        }

        return String.join(" -> ", pathNodes);
    }

    private static double getDistanceBetweenNodes(String n1, String n2) {
        String[] p1 = NODE_COORDS.get(n1).split(",");
        String[] p2 = NODE_COORDS.get(n2).split(",");
        return Math.pow(Double.parseDouble(p1[0]) - Double.parseDouble(p2[0]), 2)
                + Math.pow(Double.parseDouble(p1[1]) - Double.parseDouble(p2[1]), 2);
    }
}