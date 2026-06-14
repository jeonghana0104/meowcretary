package com.example.backend.ai.dto;

// com.example.backend.ai.dto.ChatDto 내부 파일 예시
public class ChatDto {

    // 프론트엔드가 주는 JSON Body 스펙 매핑 레코드
    public record ChatRequest(
            String message,
            Double userLat,
            Double userLng
    ) {}

    // 백엔드가 반환할 응답 구조 레코드
    public record ChatResponse(
            String answer,
            String placeName,
            String location
    ) {}
}