package com.application.stats.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFound.class)
    public ResponseEntity<Map<String, String>> handlePlayerNotFoundException(NotFound ex) {
        return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(PrivateProfile.class)
    public ResponseEntity<Map<String, String>> handlePrivateProfileException(PrivateProfile ex) {
        return ResponseEntity.status(500).body(Map.of("error", ex.getMessage()));
    }
}
