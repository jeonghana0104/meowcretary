package com.example.backend.ai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String getCompletion(String userMessage) {
        // AI가 정밀 목적지 단어 하나만 반환하도록 차단하는 시스템 족쇄 프롬프트
        String systemPrompt = """
                너는 사용자의 문장을 분석하여 오직 최적의 '목적지 건물 정식 명칭' 단어 하나만 추출하는 자동 기계다.
                인사말, 설명, 부연 텍스트, 온점(.) 등은 절대로 출력하지 말고 오직 아래 후보 중 매칭되는 정식 명칭만 딱 출력해라.
                
                [정식 목적지 명칭 리스트 및 키워드 가이드]
                - 학연산클러스터지원센터 (사용자가 학연산, 클러스터라고 하면 이를 출력)
                - 버스승강장 (사용자가 정류장, 버스정류장이라고 하면 이를 출력)
                - 제1공학관 (사용자가 공학관, 1공이라고 하면 이를 출력)
                - 학술정보관 (사용자가 도서관, 중도, 학정, 책 빌리는 곳이라고 하면 이를 출력)
                - 컨퍼런스홀 (사용자가 컨퍼런스라고 하면 이를 출력)
                - 창의관 (사용자가 창의관이라고 하면 이를 출력)
                
                예시 입력: "나 지금 정문인데 도서관 어떻게 가?"
                예시 출력: 학술정보관
                """;

        try {
            String aiResponse = this.chatClient.prompt()
                    .system(systemPrompt)
                    .user(userMessage)
                    .call()
                    .content();

            return aiResponse != null ? aiResponse.trim() : "학술정보관";
        } catch (Exception e) {
            // 하루 요청 한도 20회가 초과되는 에러(429)가 터지더라도, 백엔드가 무너지지 않고 기본값(디폴트 목적지)을 리턴하여 화면을 보호합니다.
            return "학술정보관";
        }
    }
}