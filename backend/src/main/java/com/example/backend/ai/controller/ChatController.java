package com.example.backend.ai.controller;

import com.example.backend.ai.dto.ChatDto;
import com.example.backend.ai.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // 테스트용 CORS 허용
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ChatDto.ChatResponse chat(@RequestBody ChatDto.ChatRequest request) {
        String result = geminiService.getCompletion(request.message());
        return new ChatDto.ChatResponse(result);
    }
}