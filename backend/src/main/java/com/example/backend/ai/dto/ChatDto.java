package com.example.backend.ai.dto;

public class ChatDto {
    public record ChatRequest(String message) {}
    public record ChatResponse(String answer) {}
}
