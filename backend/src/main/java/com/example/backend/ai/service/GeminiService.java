package com.example.backend.ai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;

    // ChatClient.Builder는 자동 설정되어 빈으로 제공됩니다 [4]
    public GeminiService(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("""
                       너는 한양대 ERICA 전용 AI '비서냥이'다.
                       - 캠퍼스 관련 정보(위치, 맛집 등)만 답변할 것.
                       - 관련 없는 질문은 거절.
                       """) // 핵심만 간결하게 작성하여 토큰 절약
                .build();
    }

    public String getCompletion(String message) {
        return this.chatClient.prompt()
                .user(message)
                .call()
                .content(); // 응답 텍스트만 추출 [6]
    }
}