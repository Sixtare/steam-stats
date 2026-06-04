package com.application.stats.controller;

import com.application.stats.entity.GameData;
import com.application.stats.service.GameDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gamedata")
public class GameDataController {
    private final GameDataService gameDataService;

    public GameDataController(GameDataService gameDataService) {
        this.gameDataService = gameDataService;
    }

    @GetMapping()
    public ResponseEntity<List<GameData>> getOwnedGamesData(@RequestParam("ids") String ids){
        return ResponseEntity.ok(gameDataService.getOwnedGamesData(ids));
    }

    // Endpoint to populate the database with initial game data
    @GetMapping("/populate")
    public void populateGameData() {
        gameDataService.populateDatabase();
    }
}
