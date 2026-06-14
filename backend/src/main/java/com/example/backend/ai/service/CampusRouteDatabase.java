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
    private static final Map<String, String> NODE_COORDS = new HashMap<>();
    private static final Map<String, List<String>> GRAPH = new HashMap<>();

    static {
        // 1. 🎯 주요 목적지 설정
        DATABASE.put("학연산클러스터지원센터", new RouteInfo("학연산클러스터지원센터", "언론정보관 우측 도로를 지나 학연산 전용 진입로 안쪽에 있습니다.", "37.2968381,126.838973", ""));
        DATABASE.put("버스승강장", new RouteInfo("버스승강장", "셔틀콕 동측 주차장 라인 아래쪽에 위치한 순환버스 정류장입니다.", "37.298728,126.837990", ""));
        DATABASE.put("제1공학관", new RouteInfo("제1공학관", "본관 왼쪽을 지나 제1과학기술관 모퉁이 우측에 정문이 있습니다.", "37.297819,126.836960", ""));
        DATABASE.put("학술정보관", new RouteInfo("학술정보관", "사자상과 민주광장을 지나 학생복지관 옆에 위치한 대형 도서관입니다.", "37.296817,126.835313", ""));
        DATABASE.put("컨퍼런스홀", new RouteInfo("컨퍼런스홀", "언론정보관 교차로 우측 주차장 진입로 옆에 있습니다.", "37.299056,126.836822", ""));
        DATABASE.put("창의관", new RouteInfo("창의관", "대운동장 인근을 지나 캠퍼스 남단 최외곽에 위치해 있습니다.", "37.291397,126.836301", ""));

        // 별칭(Alias) 동기화
        DATABASE.put("학연산", DATABASE.get("학연산클러스터지원센터"));
        DATABASE.put("클러스터", DATABASE.get("학연산클러스터지원센터"));
        DATABASE.put("정류장", DATABASE.get("버스승강장"));
        DATABASE.put("공학관", DATABASE.get("제1공학관"));
        DATABASE.put("도서관", DATABASE.get("학술정보관"));
        DATABASE.put("중도", DATABASE.get("학술정보관"));
        DATABASE.put("컨퍼런스", DATABASE.get("컨퍼런스홀"));

        // 2. 🗺️ 실측 고정밀 거점 노드 데이터베이스
        NODE_COORDS.put("셔틀콕", "37.300890,126.833750");
        NODE_COORDS.put("본관앞코너", "37.300150,126.834120");
        NODE_COORDS.put("언론정보관코너", "37.300400,126.835100");
        NODE_COORDS.put("공학관진입로", "37.298220,126.835400");
        NODE_COORDS.put("Hub01_한대정문사거리", "37.30022586690103,126.83776881950388");
        NODE_COORDS.put("Hub02_삼거리", "37.299896056410944,126.83708997291754");
        NODE_COORDS.put("Hub03_사거리", "37.29888116989323,126.83458545541774");
        NODE_COORDS.put("Hub04_사거리", "37.298157966862014,126.83289524005173");
        NODE_COORDS.put("Hub05_코너", "37.29696953055419,126.83038276739933");
        NODE_COORDS.put("Hub06_삼거리", "37.295670753824886,126.83105956131405");
        NODE_COORDS.put("Hub07_사거리", "37.296758134580024,126.83380343241659");
        NODE_COORDS.put("Hub08_사거리", "37.29749034292973,126.83549924489648");
        NODE_COORDS.put("Hub09_삼거리", "37.298498413922665,126.8379755464962");
        NODE_COORDS.put("Hub10_삼거리", "37.29708726809002,126.83887521414901");
        NODE_COORDS.put("Hub11_사거리", "37.29607021321981,126.83640460533294");
        NODE_COORDS.put("Hub12_삼거리", "37.29535825947573,126.83468621508209");
        NODE_COORDS.put("Hub13_사거리", "37.294084420254634,126.8354953832834");
        NODE_COORDS.put("Hub14_코너겸삼거리", "37.29337106323441,126.83279022954815");
        NODE_COORDS.put("Hub15_사거리", "37.29326745185683,126.83601594699152");
        NODE_COORDS.put("Hub16_코너", "37.29308675233701,126.83566108523374");
        NODE_COORDS.put("Hub17_삼거리", "37.2921391721147,126.83621011784047");
        NODE_COORDS.put("Hub18_삼거리", "37.29192911133026,126.83579893604042");
        NODE_COORDS.put("Hub19_코너", "37.291827333927884,126.83550311719351");
        NODE_COORDS.put("Hub20_삼거리", "37.29154598788052,126.83566725600423");
        NODE_COORDS.put("Hub21_삼거리", "37.291659000450395,126.83594331362148");
        NODE_COORDS.put("Hub22_삼거리", "37.29201615216272,126.83684293819732");
        NODE_COORDS.put("Hub23_삼거리", "37.29371500918146,126.83713431681494");
        NODE_COORDS.put("Hub24_사거리", "37.29480532227406,126.83717707894539");
        NODE_COORDS.put("Hub25_삼거리", "37.29510825973586,126.83797153953621");
        NODE_COORDS.put("Hub26_골목", "37.29639560796527,126.83714545531322");
        NODE_COORDS.put("Hub27_골목", "37.295126253391714,126.83795176407875");
        NODE_COORDS.put("Hub28_골목", "37.29558738837579,126.83912935490865");
        NODE_COORDS.put("Hub29_삼거리", "37.2958404085781,126.83966735565998");
        NODE_COORDS.put("Hub30_큰길", "37.29568683524699,126.83937444599708");
        NODE_COORDS.put("Hub31_큰길", "37.296051975743126,126.83953720563902");

        NODE_COORDS.put("학연산클러스터지원센터", "37.2968381,126.838973");
        NODE_COORDS.put("버스승강장", "37.298728,126.837990");
        NODE_COORDS.put("제1공학관", "37.297819,126.836960");
        NODE_COORDS.put("학술정보관", "37.296817,126.835313");
        NODE_COORDS.put("컨퍼런스홀", "37.299056,126.836822");
        NODE_COORDS.put("창의관", "37.291397,126.836301");

        // 3. 🔗 기본 네트워크 인접 리스트 연결
        connect("셔틀콕", "본관앞코너");
        connect("셔틀콕", "언론정보관코너");
        connect("본관앞코너", "Hub03_사거리");
        connect("언론정보관코너", "Hub02_삼거리");
        connect("Hub02_삼거리", "Hub01_한대정문사거리");
        connect("Hub02_삼거리", "컨퍼런스홀");
        connect("Hub03_사거리", "Hub04_사거리");
        connect("Hub03_사거리", "Hub08_사거리");
        connect("Hub04_사거리", "Hub05_코너");
        connect("Hub04_사거리", "Hub07_사거리");
        connect("Hub05_코너", "Hub06_삼거리");
        connect("Hub06_삼거리", "Hub14_코너겸삼거리");
        connect("Hub07_사거리", "학술정보관");
        connect("Hub07_사거리", "Hub12_삼거리");
        connect("Hub08_사거리", "공학관진입로");
        connect("Hub08_사거리", "Hub11_사거리");
        connect("공학관진입로", "제1공학관");
        connect("Hub11_사거리", "Hub09_삼거리");
        connect("Hub11_사거리", "Hub15_사거리");
        connect("Hub09_삼거리", "버스승강장");
        connect("버스승강장", "Hub10_삼거리");
        connect("Hub10_삼거리", "학연산클러스터지원센터");

        // 창의관 방면 직선 축
        connect("Hub12_삼거리", "Hub13_사거리");
        connect("Hub13_사거리", "Hub15_사거리");
        connect("Hub15_사거리", "Hub16_코너");
        connect("Hub16_코너", "Hub17_삼거리");
        connect("Hub17_삼거리", "Hub18_삼거리");
        connect("Hub18_삼거리", "Hub19_코너");
        connect("Hub19_코너", "Hub20_삼거리");
        connect("Hub20_삼거리", "Hub21_삼거리");
        connect("Hub21_삼거리", "Hub22_삼거리");
        connect("Hub22_삼거리", "창의관");

        // 외곽 순환 및 보조로
        connect("Hub10_삼거리", "Hub29_삼거리");
        connect("Hub29_삼거리", "Hub31_큰길");
        connect("Hub31_큰길", "Hub30_큰길");
        connect("Hub30_큰길", "Hub28_골목");
        connect("Hub28_골목", "Hub25_삼거리");
        connect("Hub25_삼거리", "Hub27_골목");
        connect("Hub27_골목", "Hub24_사거리");
        connect("Hub24_사거리", "Hub23_삼거리");
        connect("Hub23_삼거리", "Hub15_사거리");
        connect("Hub11_사거리", "Hub26_골목");
    }

    private static void connect(String u, String v) {
        GRAPH.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        GRAPH.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
    }

    // 💡 [추가] GeminiService에서 참조할 고정밀 맵 텍스트 가이드 컨텍스트 리턴 메서드
    public static String getCampusMapContext() {
        return """
            [한양대학교 에리카 캠퍼스 고정밀 지도 정보]
            너는 사용자가 입력한 자연어 문장에서 오직 아래의 '정식 목적지 이름' 중 하나만 추출해야 한다.
            
            - 매핑 가능한 정식 목적지 리스트:
              * 학연산클러스터지원센터 (별칭: 학연산, 클러스터)
              * 버스승강장 (별칭: 정류장, 버스정류장)
              * 제1공학관 (별칭: 공학관, 1공)
              * 학술정보관 (별칭: 도서관, 중도, 학정)
              * 컨퍼런스홀 (별칭: 컨퍼런스)
              * 창의관
            """;
    }

    // 💡 [추가] 사용자의 메시지에서 어떤 목적지를 가고 싶어 하는지 정식 명칭을 파싱해 내는 필터링 로직
    public static String extractTargetPlace(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "학술정보관"; // 기본 디폴트 값
        }
        for (String key : DATABASE.keySet()) {
            if (message.contains(key)) {
                return DATABASE.get(key).placeName; // 별칭이 걸려도 정식 명칭("학술정보관" 등)으로 반환
            }
        }
        return "학술정보관"; // 매칭 실패 시 디폴트 값 방어
    }

    public static RouteInfo retrieveContext(String message) {
        for (String key : DATABASE.keySet()) {
            if (message.contains(key)) {
                return DATABASE.get(key);
            }
        }
        return null;
    }

    public static String findClosestNode(double userLat, double userLng) {
        String closestNode = "Hub01_한대정문사거리";
        double minDistance = Double.MAX_VALUE;
        for (Map.Entry<String, String> entry : NODE_COORDS.entrySet()) {
            if (DATABASE.containsKey(entry.getKey()) && !entry.getKey().equals("버스승강장")) continue;
            String[] parts = entry.getValue().split(",");
            double dist = calculateHaversine(userLat, userLng, Double.parseDouble(parts[0]), Double.parseDouble(parts[1]));
            if (dist < minDistance) {
                minDistance = dist;
                closestNode = entry.getKey();
            }
        }
        return NODE_COORDS.get(closestNode);
    }

    // 🗺️ 다익스트라 최단 경로 계산기 (자바 내부 연산 가동)
    public static String calculateSmartPath(double userLat, double userLng, String targetPlace) {
        String endNode = targetPlace;
        if (endNode == null || !NODE_COORDS.containsKey(endNode)) {
            endNode = "학술정보관";
        }

        String startNode = "Hub01_한대정문사거리";

        if (userLat != 0.0 && userLng != 0.0) {
            double minStartDist = Double.MAX_VALUE;
            for (Map.Entry<String, String> entry : NODE_COORDS.entrySet()) {
                if (DATABASE.containsKey(entry.getKey()) && !entry.getKey().equals("버스승강장")) continue;
                String[] parts = entry.getValue().split(",");
                double dist = calculateHaversine(userLat, userLng, Double.parseDouble(parts[0]), Double.parseDouble(parts[1]));
                if (dist < minStartDist) {
                    minStartDist = dist;
                    startNode = entry.getKey();
                }
            }
        }

        if (startNode.equals(endNode)) {
            return NODE_COORDS.get(startNode);
        }

        try {
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
                    double edgeWeight = getDistanceBetweenNodes(currName, neighbor);
                    double newDist = currDist + edgeWeight;

                    if (newDist < distances.get(neighbor)) {
                        distances.put(neighbor, newDist);
                        parentNodes.put(neighbor, currName);
                        pq.add(new String[]{neighbor, String.valueOf(newDist)});
                    }
                }
            }

            List<String> finalCoordinatesList = new ArrayList<>();
            String step = endNode;
            while (step != null) {
                finalCoordinatesList.add(0, NODE_COORDS.get(step));
                step = parentNodes.get(step);
            }

            return String.join(" -> ", finalCoordinatesList);

        } catch (Exception e) {
            return NODE_COORDS.get("Hub01_한대정문사거리") + " -> " + NODE_COORDS.get(endNode);
        }
    }

    private static double getDistanceBetweenNodes(String n1, String n2) {
        String[] p1 = NODE_COORDS.get(n1).split(",");
        String[] p2 = NODE_COORDS.get(n2).split(",");
        return calculateHaversine(Double.parseDouble(p1[0]), Double.parseDouble(p1[1]), Double.parseDouble(p2[0]), Double.parseDouble(p2[1]));
    }

    private static double calculateHaversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}