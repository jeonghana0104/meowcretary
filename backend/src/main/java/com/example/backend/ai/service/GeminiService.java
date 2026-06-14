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
        // AI가 목적지만 정확히 필터링할 수 있도록 묶는 족쇄 프롬프트
        String systemPrompt = """
                너는 사용자의 입력 문장에서 오직 최종 '목적지 단어'만 추출하는 매핑 로봇이다.
                부연 설명, 온점, 안내 텍스트는 단 한 글자도 적지 말고 오직 아래 정식 명칭 중 하나만 출력해라.
                
                [정식 목적지 후보 리스트]
                - 학연산클러스터지원센터 (사용자가 학연산, 클러스터라고 하면 이걸 출력)
                - 버스승강장 (사용자가 정류장, 버스정류장이라고 하면 이걸 출력)
                - 제1공학관 (사용자가 공학관, 1공이라고 하면 이걸 출력)
                - 학술정보관 (사용자가 도서관, 중도, 학정이라고 하면 이걸 출력)
                - 컨퍼런스홀 (사용자가 컨퍼런스라고 하면 이걸 출력)
                - 창의관
                
                예시: 사용자가 "나 지금 정문인데 도서관 어떻게 가?" 라고 하면 오직 딱 이 네 글자만 출력해라: 학술정보관
                """;

        try {
            String aiResponse = this.chatClient.prompt()
                    .system(systemPrompt)
                    .user(userMessage)
                    .call()
                    .content();

            return aiResponse != null ? aiResponse.trim() : "학술정보관";
        } catch (Exception e) {
            // 구글 무료 티어 한도 초과(429) 에러가 나더라도 백엔드가 터지지 않고 기본값을 반환하여 프론트를 보호합니다.
            return "학술정보관";
        }
    }
}