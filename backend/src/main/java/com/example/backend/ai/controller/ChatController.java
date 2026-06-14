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
        String message = (String) payload.get("message");

        // 프론트에서 넘어오는 위경도 안전하게 캐스팅
        double userLat = 0.0;
        double userLng = 0.0;
        if (payload.get("lat") != null) {
            userLat = Double.parseDouble(payload.get("lat").toString());
        }
        if (payload.get("lng") != null) {
            userLng = Double.parseDouble(payload.get("lng").toString());
        }

        // 1. AI에게는 '목적지가 어딘지' 텍스트만 추출시킵니다 (가장 가벼움, 하루 20회 한도 방어)
        String targetPlace = geminiService.getCompletion(message);

        // 2. 찾아낸 목적지를 바탕으로, 진짜 위경도 연산은 자바 다익스트라 엔진(SmartPath)이 정밀하게 계산합니다.
        String aiPathResult = CampusRouteDatabase.calculateSmartPath(userLat, userLng, targetPlace);

        if (aiPathResult == null) {
            aiPathResult = "";
        }

        // 3. 프론트엔드가 한 치의 오차도 없이 파싱할 수 있게 완벽한 수동 JSON 형식을 포맷팅합니다.
        String jsonResponse = "{"
                + "\"description\":\"AI와 알고리즘이 계산한 최적의 캠퍼스 내부 경로입니다.\","
                + "\"path\":\"" + aiPathResult.trim() + "\""
                + "}";

        return ResponseEntity.ok(jsonResponse);
    }
}