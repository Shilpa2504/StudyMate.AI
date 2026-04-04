package com.practisespring.Practise_spring.service;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Value;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
public class AIService {
    @Value("${gemini.api.key}")
    private String apiKey;

    private final String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
;
    public String generateAnswer(String documentText, String question) {

        String prompt = "Answer the question based on the document.\n\nDOCUMENT:\n"
                + documentText +
                "\n\nQUESTION:\n" + question;

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                apiUrl + apiKey,
                request,
                Map.class
        );

        try {
            List candidates = (List) response.getBody().get("candidates");
            Map first = (Map) candidates.get(0);
            Map contentMap = (Map) first.get("content");
            List parts = (List) contentMap.get("parts");
            Map textMap = (Map) parts.get(0);

            return textMap.get("text").toString();

        } catch (Exception e) {
            return "Error getting AI response";
        }
    }


}
