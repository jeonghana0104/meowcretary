package com.example.backend.ai.controller;

import com.example.backend.ai.service.CampusRouteDatabase;
import com.example.backend.ai.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, Object> payload) {
        // 프론트엔드(MapPage.tsx)의 전송 키 명칭에 맞춰 안전하게 가로채기
        String message = (String) payload.get("message");
        double userLat = payload.get("userLat") != null ? Double.parseDouble(payload.get("userLat").toString()) : 37.30089;
        double userLng = payload.get("userLng") != null ? Double.parseDouble(payload.get("userLng").toString()) : 126.83375;

        // 1. AI(Gemini)에게는 복잡한 좌표 계산 대신 "어디 건물이 목적인지" 정식 단어 하나만 추출 시킵니다.
        String targetPlace = geminiService.getCompletion(message);

        // 2. 찾아낸 목적지 건물 이름을 바탕으로 자바 다익스트라 엔진이 정밀 코너 최단 경로 계산
        String polylineRoute = CampusRouteDatabase.calculateSmartPath(userLat, userLng, targetPlace);

        // 3. 디비에서 해당 장소의 실제 마커용 위경도 정보 획득
        CampusRouteDatabase.RouteInfo info = CampusRouteDatabase.retrieveContext(targetPlace);
        String targetLocationCoords = (info != null) ? info.targetLocation : "37.296817,126.835313";
        String displayDescription = (info != null) ? info.description : "캠퍼스 내부 시설 안내입니다.";

        // 4. ⭐ 프론트엔드 MapPage.tsx가 한 글자의 오차도 없이 파싱할 수 있게 필수 포맷 완벽 조립
        String combinedLocation = targetLocationCoords + "|" + polylineRoute;

        String jsonResponse = "{"
                + "\"answer\":\"**" + targetPlace + "** 가시는 길이군요! " + displayDescription + "\","
                + "\"location\":\"" + combinedLocation.trim() + "\","
                + "\"placeName\":\"" + targetPlace + "\""
                + "}";

        return ResponseEntity.ok(jsonResponse);
    }
}