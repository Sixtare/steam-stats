package com.application.stats.controller;

import com.application.stats.dtos.ComparisonStats;
import com.application.stats.service.CompareService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compare")
public class CompareController {
    private final CompareService compareService;

    public CompareController(CompareService compareService) {
        this.compareService = compareService;
    }

    @GetMapping()
    public ResponseEntity<ComparisonStats> comparePlayers(@RequestParam("id1") Long id1, @RequestParam("id2") Long id2) {
        ComparisonStats stats = compareService.comparePlayers(id1, id2);
        return ResponseEntity.ok(stats);
    }
}
