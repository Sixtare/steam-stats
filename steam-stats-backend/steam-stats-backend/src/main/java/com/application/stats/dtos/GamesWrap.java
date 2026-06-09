package com.application.stats.dtos;

import java.util.Arrays;

public record GamesWrap(Integer game_count, Integer total_hours, Games[] games) {

    public GamesWrap {
        if (games == null){
            total_hours = 0;
            game_count = 0;
        } else {
            total_hours = (Arrays.stream(games).mapToInt(Games::playtime_forever).sum()) / 60;
            game_count = games.length;
        }

    }
}
