package com.application.stats.controller;

import com.application.stats.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping()
    public ResponseEntity<?> getStatsById(@RequestParam("id") Long id) {
        return ResponseEntity.ok(playerService.getPlayerInfo(id));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validatePlayerId(@RequestParam("url") String id) {
        return ResponseEntity.ok(playerService.getPlayerId(id));
    }

    @GetMapping("/gamelist")
    public ResponseEntity<?> getGameListById(@RequestParam("id") Long id) {
        return ResponseEntity.ok(playerService.getPlayerGames(id));
    }

    @GetMapping("/lastplayed")
    public ResponseEntity<?> getLastPlayedGamesById(@RequestParam("id") Long id) {
        return ResponseEntity.ok(playerService.getLastPlayedGames(id));
    }
}
